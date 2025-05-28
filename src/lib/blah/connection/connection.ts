import { version } from '$app/environment';
import type { BlahSignedPayload, SignOptions } from '@blah-im/core/crypto';
import {
	blahUserUnregisteredResponseSchema,
	type BlahAuth,
	type BlahMessage,
	type BlahUserRegisterRequest
} from '../structures';
import { BlahError } from './error';
import type { BlahIdentity } from '@blah-im/core/identity';

const RECONNECT_TIMEOUT = 1500;
const RECONNECT_MAX_TRIES = 5;

export type MessageListener = (message: BlahSignedPayload<BlahMessage>) => void;
export interface MessageFilter {
	roomID?: string;
}
export interface MessageSubscription {
	unsubscribe: () => void;
}

export class BlahChatServerConnection {
	private static commonHeaders = { 'x-blah-client': `Weblah/${version}` };

	private endpoint_: string;
	private identity_: BlahIdentity | null;

	get endpoint() {
		return this.endpoint_;
	}

	get identity() {
		return this.identity_;
	}

	private webSocket: WebSocket | null = null;
	private roomListeners: Map<string, Set<MessageListener>> = new Map();
	private serverListeners: Set<MessageListener> = new Set();
	private webSocketRetryTimeout: number | null = null;

	constructor(endpoint: string, identity: BlahIdentity | null = null) {
		this.endpoint_ = new URL(endpoint).href.replace(/\/$/, '');
		this.identity_ = identity;
	}

	private async generateAuthHeader(): Promise<{ Authorization: string }> {
		if (!this.identity) throw new Error('Must generate auth header with an identity');
		const authPayload: BlahAuth = { typ: 'auth' };
		const signedAuthPayload = await this.identity.signPayload(authPayload);
		return { Authorization: JSON.stringify(signedAuthPayload) };
	}

	private async fetchWithAuthHeader(url: string | URL, init?: RequestInit): Promise<Response> {
		const authHeader = await this.generateAuthHeader();
		return fetch(url, {
			...init,
			headers: { ...BlahChatServerConnection.commonHeaders, ...authHeader, ...init?.headers }
		});
	}

	private async fetchWithSignedPayload<P>(
		url: string,
		payload: P,
		init?: RequestInit,
		signOptions?: Omit<SignOptions, 'identityKeyID'>
	): Promise<Response> {
		if (!this.identity) throw new Error('Must fetch with an identity');

		const signedPayload = await this.identity.signPayload(payload, signOptions);
		return fetch(url, {
			...init,
			headers: {
				...BlahChatServerConnection.commonHeaders,
				'content-type': 'application/json',
				...init?.headers
			},
			body: JSON.stringify(signedPayload)
		});
	}

	public async apiCall<P, R>(
		method: 'POST' | 'GET',
		path: `/${string}` | [`/${string}`, { [query: string]: string | null | undefined }],
		payload?: P,
		signOptions?: Omit<SignOptions, 'identityKeyID'>
	): Promise<R> {
		if (payload && !this.identity)
			throw new Error('Must make authorized API call with an identity');

		const url = new URL(typeof path === 'string' ? path : path[0], this.endpoint_);
		const query = typeof path === 'string' ? undefined : path[1];
		if (query) {
			for (const [key, value] of Object.entries(query)) {
				if (value) url.searchParams.append(key, value);
			}
		}

		let response: Response;
		if (method === 'GET') {
			if (this.identity) {
				response = await this.fetchWithAuthHeader(url);
			} else {
				response = await fetch(url, {
					headers: BlahChatServerConnection.commonHeaders
				});
			}
		} else {
			response = await this.fetchWithSignedPayload(
				`${this.endpoint_}${path}`,
				payload,
				{ method },
				signOptions
			);
		}

		if (!response.ok) throw await BlahError.fromResponse(response);
		return await response.json();
	}

	async tryRegisterIfNoyYet(): Promise<void> {
		if (!this.identity) throw new Error('Must register with an identity');

		try {
			await this.apiCall('GET', '/user/me');
		} catch (e) {
			if (e instanceof BlahError && e.statusCode === 404) {
				const { data } = blahUserUnregisteredResponseSchema.safeParse(e.raw);
				if (!data) throw e;

				const request: BlahUserRegisterRequest = {
					typ: 'user_register',
					server_url: this.endpoint_,
					id_url: this.identity.profile.id_urls[0],
					id_key: this.identity.idPublicKey.id,
					challenge: {
						pow: { nonce: data.register_challenge.pow.nonce }
					}
				};

				const response = await this.apiCall('POST', '/user/register', request, {
					powDifficulty: data.register_challenge.pow.difficulty
				});
			} else {
				throw e;
			}
		}
	}

	private createWebSocket(remainingTries: number = RECONNECT_MAX_TRIES - 1): WebSocket {
		const socket = new WebSocket(`${this.endpoint_}/ws`);
		const onSocketClose = (e: Event) => {
			console.error('WebSocket error or closed:', e);
			this.webSocket?.close();
			if (remainingTries > 0)
				this.webSocketRetryTimeout = setTimeout(
					() => (this.webSocket = this.createWebSocket(remainingTries - 1)),
					RECONNECT_TIMEOUT
				);
		};

		socket.addEventListener('close', onSocketClose);

		socket.addEventListener('open', async () => {
			if (this.identity) {
				const { Authorization } = await this.generateAuthHeader();
				socket.send(Authorization);
			}
		});

		socket.addEventListener('message', (event) => {
			const frameJson: { chat: BlahSignedPayload<BlahMessage> } | { lagged: boolean } = JSON.parse(
				event.data
			);

			if ('chat' in frameJson) {
				const message = frameJson.chat;
				const listeners = this.roomListeners.get(message.signee.payload.room);
				if (listeners) for (const listener of listeners) listener(message);
			} else {
				console.log('Unknown WebSocket frame:', frameJson);
			}
		});

		return socket;
	}

	connect() {
		if (!this.webSocket && this.identity) this.webSocket = this.createWebSocket();
	}

	disconnect() {
		if (this.webSocketRetryTimeout) clearTimeout(this.webSocketRetryTimeout);
		this.webSocket?.close();
		this.webSocket = null;
	}

	changeIdentity(newIdentity: BlahIdentity | null) {
		this.identity_ = newIdentity;
		if (this.webSocket) {
			this.disconnect();
			this.connect();
		}
	}

	subscribe(listener: MessageListener, filter: MessageFilter = {}): MessageSubscription {
		const roomID = filter.roomID;

		if (roomID) {
			const listeners = this.roomListeners.get(roomID) ?? new Set();
			listeners.add(listener);
			this.roomListeners.set(roomID, listeners);

			return {
				unsubscribe: () => {
					const listeners = this.roomListeners.get(roomID) ?? new Set();
					listeners.delete(listener);
					if (listeners.size === 0) {
						this.roomListeners.delete(roomID);
					}
				}
			};
		}

		this.serverListeners.add(listener);

		return {
			unsubscribe: () => this.serverListeners.delete(listener)
		};
	}
}

import { version } from '$app/environment';
import type { BlahRichText } from '@blah-im/core/richText';
import type { BlahKeyPair, BlahSignedPayload } from '@blah-im/core/crypto';
import type { BlahAuth, BlahMessage, BlahRoomInfo, BlahUserJoinMessage } from '../structures';
import { BlahError } from './error';

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
	private keypair_: BlahKeyPair | null;

	get endpoint() {
		return this.endpoint_;
	}

	get keypair() {
		return this.keypair_;
	}

	private webSocket: WebSocket | null = null;
	private roomListeners: Map<string, Set<MessageListener>> = new Map();
	private serverListeners: Set<MessageListener> = new Set();
	private webSocketRetryTimeout: number | null = null;

	constructor(endpoint: string, keypair: BlahKeyPair | null = null) {
		this.endpoint_ = endpoint;
		this.keypair_ = keypair;
	}

	private async generateAuthHeader(): Promise<{ Authorization: string }> {
		if (!this.keypair) throw new Error('Must generate auth header with a keypair');
		const authPayload: BlahAuth = { typ: 'auth' };
		const signedAuthPayload = await this.keypair.signPayload(authPayload);
		return { Authorization: JSON.stringify(signedAuthPayload) };
	}

	private async fetchWithAuthHeader(url: string, init?: RequestInit): Promise<Response> {
		const authHeader = await this.generateAuthHeader();
		return fetch(url, {
			...init,
			headers: { ...BlahChatServerConnection.commonHeaders, ...authHeader, ...init?.headers }
		});
	}

	private async fetchWithSignedPayload<P>(
		url: string,
		payload: P,
		init?: RequestInit
	): Promise<Response> {
		if (!this.keypair) throw new Error('Must fetch with a keypair');

		const signedPayload = await this.keypair.signPayload(payload);
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

	public async apiCall<P, R>(method: 'POST' | 'GET', path: `/${string}`, payload?: P): Promise<R> {
		if (payload && !this.keypair) throw new Error('Must make authorized API call with a keypair');

		let response: Response;
		if (method === 'GET') {
			if (this.keypair) {
				response = await this.fetchWithAuthHeader(`${this.endpoint_}${path}`);
			} else {
				response = await fetch(`${this.endpoint_}${path}`, {
					headers: BlahChatServerConnection.commonHeaders
				});
			}
		} else {
			response = await this.fetchWithSignedPayload(`${this.endpoint_}${path}`, payload, { method });
		}

		if (!response.ok) throw await BlahError.fromResponse(response);
		return await response.json();
	}

	async tryRegisterIfNoyYet(): Promise<void> {
		if (!this.keypair) throw new Error('Must register with a keypair');

		try {
			await this.apiCall('GET', '/user/me');
		} catch (e) {
			if (e instanceof BlahError && e.statusCode === 404) {
				// TODO: Register user
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
			if (this.keypair) {
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
		if (!this.webSocket && this.keypair) this.webSocket = this.createWebSocket();
	}

	disconnect() {
		if (this.webSocketRetryTimeout) clearTimeout(this.webSocketRetryTimeout);
		this.webSocket?.close();
		this.webSocket = null;
	}

	changeKeyPair(keypair: BlahKeyPair | null) {
		this.keypair_ = keypair;
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

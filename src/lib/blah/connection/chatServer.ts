import { version } from '$app/environment';
import type { BlahRichText } from '$lib/richText';
import type { BlahKeyPair, BlahSignedPayload } from '../crypto';
import type { BlahAuth, BlahMessage, BlahRoomInfo, BlahUserJoinMessage } from '../structures';
import { BlahError } from './error';

const RECONNECT_TIMEOUT = 1500;
const RECONNECT_MAX_TRIES = 5;

export class BlahChatServerConnection {
	private static commonHeaders = { 'x-blah-client': `Weblah/${version}` };

	private endpoint: string;
	private keypair?: BlahKeyPair;

	private webSocket: WebSocket | null = null;
	private messageListeners: Map<string, Set<(message: BlahSignedPayload<BlahMessage>) => void>> =
		new Map();
	private webSocketRetryTimeout: number | null = null;

	constructor(endpoint: string, keypair?: BlahKeyPair) {
		this.endpoint = endpoint;
		this.keypair = keypair;
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

	private async apiCall<P, R>(method: 'POST' | 'GET', path: `/${string}`, payload?: P): Promise<R> {
		if (payload && !this.keypair) throw new Error('Must make authorized API call with a keypair');

		let response: Response;
		if (method === 'GET') {
			if (this.keypair) {
				response = await this.fetchWithAuthHeader(`${this.endpoint}${path}`);
			} else {
				response = await fetch(`${this.endpoint}${path}`, {
					headers: BlahChatServerConnection.commonHeaders
				});
			}
		} else {
			response = await this.fetchWithSignedPayload(`${this.endpoint}${path}`, payload, { method });
		}

		if (!response.ok) throw await BlahError.fromResponse(response);
		return await response.json();
	}

	async joinRoom(id: string): Promise<void> {
		if (!this.keypair) throw new Error('Must join with a keypair');

		const payload: BlahUserJoinMessage = {
			typ: 'add_member',
			room: id,
			permission: 1,
			user: this.keypair.id
		};

		await this.apiCall('POST', `/room/${id}/admin`, payload);
	}

	async sendMessage(room: string, message: BlahRichText): Promise<void> {
		if (!this.keypair) throw new Error('Must send message with a keypair');
		const payload: BlahMessage = { room, rich_text: message, typ: 'chat' };
		await this.apiCall('POST', `/room/${room}/item`, payload);
	}

	async fetchRoomInfo(roomId: string): Promise<BlahRoomInfo> {
		const room: BlahRoomInfo = await this.apiCall('GET', `/room/${roomId}`);
		return room;
	}

	async fetchRoomHistory(roomId: string): Promise<BlahSignedPayload<BlahMessage>[]> {
		const { items }: { items: BlahSignedPayload<BlahMessage>[] } = await this.apiCall(
			'GET',
			`/room/${roomId}/item`
		);
		return items;
	}

	private createWebSocket(remainingTries: number = RECONNECT_MAX_TRIES - 1): WebSocket {
		const socket = new WebSocket(`${this.endpoint}/ws`);
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
				const listeners = this.messageListeners.get(message.signee.payload.room);
				if (listeners) for (const listener of listeners) listener(message);
			} else {
				console.log('Unknown WebSocket frame:', frameJson);
			}
		});

		return socket;
	}

	subscribeRoom(
		roomId: string,
		onNewMessage: (message: BlahSignedPayload<BlahMessage>) => void
	): { unsubscribe: () => void } {
		if (!this.webSocket) this.webSocket = this.createWebSocket();

		const listeners = this.messageListeners.get(roomId) ?? new Set();
		listeners.add(onNewMessage);
		this.messageListeners.set(roomId, listeners);

		return {
			unsubscribe: () => {
				const listeners = this.messageListeners.get(roomId) ?? new Set();
				listeners.delete(onNewMessage);
				if (listeners.size === 0) {
					this.messageListeners.delete(roomId);
				}
				if (this.messageListeners.size === 0) {
					if (this.webSocketRetryTimeout) clearTimeout(this.webSocketRetryTimeout);
					this.webSocket?.close();
					this.webSocket = null;
				}
			}
		};
	}
}

import { version } from '$app/environment';
import type { BlahRichText } from '$lib/richText';
import type { BlahKeyPair, BlahSignedPayload } from '../crypto';
import type { BlahAuth, BlahMessage, BlahRoomInfo, BlahUserJoinMessage } from '../structures';
import { BlahError } from './error';

export class BlahChatServerConnection {
	private static commonHeaders = { 'x-blah-client': `Weblah/${version}` };

	private endpoint: string;
	private keypair?: BlahKeyPair;

	private eventSources: Map<string, EventSource> = new Map();
	private messageListeners: Map<string, Set<(event: MessageEvent) => void>> = new Map();

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

	private async apiCall<P, R>(path: `/${string}`, payload?: P): Promise<R> {
		if (payload && !this.keypair) throw new Error('Must make authorized API call with a keypair');

		let response: Response;
		if (payload) {
			response = await this.fetchWithSignedPayload(`${this.endpoint}${path}`, payload);
		} else {
			if (this.keypair) {
				response = await this.fetchWithAuthHeader(`${this.endpoint}${path}`);
			} else {
				response = await fetch(`${this.endpoint}${path}`, {
					headers: BlahChatServerConnection.commonHeaders
				});
			}
		}

		if (!response.ok) throw BlahError.fromResponse(response);
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

		await this.apiCall(`/room/${id}/join`, payload);
	}

	async sendMessage(room: string, message: BlahRichText): Promise<void> {
		if (!this.keypair) throw new Error('Must send message with a keypair');
		const payload: BlahMessage = { room, rich_text: message, typ: 'chat' };
		await this.fetchWithSignedPayload(`/room/${room}/item`, payload);
	}

	async fetchRoom(
		roomId: string
	): Promise<{ room: BlahRoomInfo; messages: BlahSignedPayload<BlahMessage>[] }> {
		const [room, messages]: [BlahRoomInfo, [number, BlahSignedPayload<BlahMessage>][]] =
			await this.apiCall(`/room/${roomId}/item`);
		return { room, messages: messages.toSorted(([a], [b]) => a - b).map(([, message]) => message) };
	}

	private createEventSource(roomId: string): EventSource {
		const source = new EventSource(`${this.endpoint}/room/${roomId}/event`);
		const onSourceError = (e: Event) => {
			console.error('EventSource error:', e);
			this.eventSources.delete(roomId);
			// Retry
			this.eventSources.set(roomId, this.createEventSource(roomId));
		};

		source.addEventListener('error', onSourceError);

		// Attach back any existing listeners
		const listeners = this.messageListeners.get(roomId) ?? new Set();
		listeners.forEach((listener) => source?.addEventListener('message', listener));

		return source;
	}

	subscribeRoom(
		roomId: string,
		onNewMessage: (message: BlahSignedPayload<BlahMessage>) => void
	): { unsubscribe: () => void } {
		let source = this.eventSources.get(roomId);
		if (!source) {
			source = this.createEventSource(roomId);
		}

		const listener = (event: MessageEvent) => {
			const message = JSON.parse(event.data) as BlahSignedPayload<BlahMessage>;
			onNewMessage(message);
		};

		source.addEventListener('message', listener);
		const listeners = this.messageListeners.get(roomId) ?? new Set();
		listeners.add(listener);
		this.messageListeners.set(roomId, listeners);

		return {
			unsubscribe: () => {
				source?.removeEventListener('message', listener);
				const listeners = this.messageListeners.get(roomId) ?? new Set();
				listeners.delete(listener);
				if (listeners.size === 0) {
					source?.close();
					this.eventSources.delete(roomId);
					this.messageListeners.delete(roomId);
				}
			}
		};
	}
}

import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';
import { BlahChatServerConnection } from './blah/connection/chatServer';
import { BlahKeyPair, type EncodedBlahKeyPair } from './blah/crypto';
import { currentKeyPair } from './keystore';

export const chatServers = persisted<string[]>('weblah-chat-servers', ['https://blah.oxa.li/api']);

class ChatServerConnectionPool {
	private connections: Map<string, BlahChatServerConnection> = new Map();
	private keypair: BlahKeyPair | null = null;

	constructor() {
		chatServers.subscribe(this.onChatServersChange.bind(this));
		currentKeyPair.subscribe(this.onKeyPairChange.bind(this));
	}

	connectAll(keypair?: BlahKeyPair) {
		for (const endpoint of get(chatServers)) {
			const connection = new BlahChatServerConnection(endpoint, keypair);
			this.connections.set(endpoint, connection);
			connection.connect();
		}
	}
	disconnectAll() {
		for (const connection of this.connections.values()) {
			connection.disconnect();
		}
		this.connections.clear();
	}

	private async onKeyPairChange(encodedKeyPair: EncodedBlahKeyPair) {
		this.keypair = await BlahKeyPair.fromEncoded(encodedKeyPair);
		for (const connection of this.connections.values()) {
			connection.changeKeyPair(this.keypair);
		}
	}

	private async onChatServersChange(newChatServers: string[]) {
		// Disconnect from chat servers that are no longer in the list
		for (const [endpoint, connection] of this.connections.entries()) {
			if (!newChatServers.includes(endpoint)) {
				connection.disconnect();
				this.connections.delete(endpoint);
			}
		}

		// Connect to chat servers that are in the list but not yet connected
		for (const endpoint of newChatServers) {
			if (!this.connections.has(endpoint)) {
				const connection = new BlahChatServerConnection(endpoint, this.keypair);
				this.connections.set(endpoint, connection);
				connection.connect();
			}
		}
	}

	getConnection(endpoint: string): BlahChatServerConnection | null {
		return this.connections.get(endpoint) ?? null;
	}
}

export const chatServerConnectionPool = new ChatServerConnectionPool();

import { get } from 'svelte/store';
import { BlahChatServerConnection } from './blah/connection';
import { BlahKeyPair, type EncodedBlahKeyPair } from '@blah-im/core/crypto';
import { ChatListManager } from './chatList';
import { browser } from '$app/environment';
import { GlobalSearchManager } from './globalSearch';
import type { BlahIdentity } from '@blah-im/core/identity';

export const defaultChatServers = ['https://blah.oxa.li/api'];

export class ChatServerConnectionPool {
	#connections: Map<string, BlahChatServerConnection> = new Map();
	#identity: BlahIdentity | null = null;
	#chatServers: string[] = defaultChatServers;

	chatList: ChatListManager = new ChatListManager();
	searchManager: GlobalSearchManager = new GlobalSearchManager(this.connections);

	constructor(identity: BlahIdentity, chatServers: string[] = defaultChatServers) {
		this.#identity = identity;
		this.#chatServers = chatServers;
	}

	private createAndConnect(endpoint: string) {
		const connection = new BlahChatServerConnection(endpoint, this.#identity);
		this.#connections.set(endpoint, connection);
		connection.connect();
		this.setupChatList(connection);
	}

	private fetchJoinedRooms(connection: BlahChatServerConnection) {
		connection
			.fetchJoinedRooms()
			.then((rooms) => this.chatList.ingestChats(rooms, connection.endpoint));
	}

	private setupChatList(connection: BlahChatServerConnection) {
		this.fetchJoinedRooms(connection);
		connection.subscribe((message) => this.chatList.ingestMessage(message, connection.endpoint));
	}

	connectAll() {
		for (const endpoint of get(chatServers)) {
			this.createAndConnect(endpoint);
		}
	}
	disconnectAll() {
		for (const connection of this.connections.values()) {
			connection.disconnect();
		}
		this.connections.clear();
	}

	private async onKeyPairChange(encodedKeyPair: EncodedBlahKeyPair | null) {
		this.keypair = encodedKeyPair ? await BlahKeyPair.fromEncoded(encodedKeyPair) : null;
		for (const connection of this.connections.values()) {
			connection.changeKeyPair(this.keypair);
			connection.connect();
			this.fetchJoinedRooms(connection);
		}
	}

	private async onChatServersChange(newChatServers: string[]) {
		// Disconnect from chat servers that are no longer in the list
		const disconnectedEndpoints: string[] = [];
		for (const [endpoint, connection] of this.connections.entries()) {
			if (!newChatServers.includes(endpoint)) {
				connection.disconnect();
				this.connections.delete(endpoint);
				disconnectedEndpoints.push(endpoint);
			}
		}
		this.chatList.leaveChatServers(disconnectedEndpoints);

		// Connect to chat servers that are in the list but not yet connected
		for (const endpoint of newChatServers) {
			if (!this.connections.has(endpoint)) {
				this.createAndConnect(endpoint);
			}
		}
	}

	getConnection(endpoint: string): BlahChatServerConnection | null {
		return this.connections.get(endpoint) ?? null;
	}
}

import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';
import { BlahChatServerConnection } from './blah/connection/chatServer';
import { BlahKeyPair, type EncodedBlahKeyPair } from './blah/crypto';
import { currentKeyPair } from './keystore';
import { ChatListManager } from './chatList';
import { browser } from '$app/environment';

export const chatServers = persisted<string[]>('weblah-chat-servers', ['https://blah.oxa.li/api']);

class ChatServerConnectionPool {
	private connections: Map<string, BlahChatServerConnection> = new Map();
	private keypair: BlahKeyPair | null = null;
	chatList: ChatListManager = new ChatListManager();

	constructor() {
		if (browser) {
			chatServers.subscribe(this.onChatServersChange.bind(this));
			currentKeyPair.subscribe(this.onKeyPairChange.bind(this));
		}
	}

	private createAndConnect(endpoint: string) {
		const connection = new BlahChatServerConnection(endpoint, this.keypair);
		this.connections.set(endpoint, connection);
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

	private async onKeyPairChange(encodedKeyPair: EncodedBlahKeyPair) {
		this.keypair = await BlahKeyPair.fromEncoded(encodedKeyPair);
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

export const chatServerConnectionPool = new ChatServerConnectionPool();

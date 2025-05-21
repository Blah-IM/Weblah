import type { BlahRichText } from '@blah-im/core/richText';
import type { BlahSignedPayload } from '@blah-im/core/crypto';

import type { BlahChatServerConnection } from './connection';
import type { BlahMessage } from '../structures';

export class MessageManager {
	connection: BlahChatServerConnection;
	roomID: string;
	messages: BlahSignedPayload<BlahMessage>[] = $state([]);

	constructor(connection: BlahChatServerConnection, roomID: string) {
		this.connection = connection;
		this.roomID = roomID;
	}

	async sendMessage(message: BlahRichText): Promise<void> {
		if (!this.connection.identity) throw new Error('Must send message with a keypair');
		const payload: BlahMessage = { room: this.roomID, rich_text: message, typ: 'chat' };
		await this.connection.apiCall('POST', `/room/${payload.room}/item`, payload);
	}

	async fetchRoomHistory() {
		const { items }: { items: BlahSignedPayload<BlahMessage>[] } = await this.connection.apiCall(
			'GET',
			`/room/${this.roomID}/item`
		);
		this.messages = items;
	}

	listen() {
		return this.connection.subscribe((m) => this.messages.push(m), { roomID: this.roomID })
			.unsubscribe;
	}
}

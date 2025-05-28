import type { BlahRichText } from '@blah-im/core/richText';
import type { BlahSignedPayload } from '@blah-im/core/crypto';

import type { BlahChatServerConnection } from '../connection';
import type { BlahMessage } from '../structures';
import { sectionMessages, type MessageSection } from './sectioning';
import { messageFromBlah } from '$lib/types';

export class MessageManager {
	connection: BlahChatServerConnection;
	roomID: string;
	rawMessages: BlahSignedPayload<BlahMessage>[] = $state([]);
	sectionedMessages: MessageSection[] = $derived(
		sectionMessages(this.rawMessages.map(messageFromBlah))
	);
	#currentMessageID: string | null = $state(null);

	get currentMessageID(): string | null {
		return this.#currentMessageID;
	}

	set currentMessageID(id: string | null) {
		this.currentMessageID = id;
		this.fetchRoomHistory(id);
	}

	constructor(
		connection: BlahChatServerConnection,
		roomID: string,
		currentMessageID: string | null
	) {
		this.connection = connection;
		this.roomID = roomID;
		this.currentMessageID = currentMessageID;

		$effect(() => this.listen());
		this.fetchRoomHistory();
	}

	async sendMessage(message: BlahRichText): Promise<void> {
		if (!this.connection.identity) throw new Error('Must send message with a keypair');
		const payload: BlahMessage = { room: this.roomID, rich_text: message, typ: 'chat' };
		await this.connection.apiCall('POST', `/room/${payload.room}/msg`, payload);
	}

	async fetchRoomHistory(skipToken: string | null = null) {
		const { items }: { items: BlahSignedPayload<BlahMessage>[] } = await this.connection.apiCall(
			'GET',
			[`/room/${this.roomID}/msg`, { skip_token: skipToken ?? this.currentMessageID }]
		);
		this.rawMessages = items;
	}

	listen() {
		return this.connection.subscribe((m) => this.rawMessages.push(m), { roomID: this.roomID })
			.unsubscribe;
	}
}

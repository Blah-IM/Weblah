import { derived, readable, type Readable } from 'svelte/store';
import type { BlahChatServerConnection } from './blah/connection/chatServer';
import type { BlahRichText } from './richText';
import { messageFromBlah, type Chat, type Message, type User } from './types';
import { BlahError } from './blah/connection/error';

const MAX_MESSAGES_PER_SECTION = 10;
const SHOW_TIME_AFTER_SILENCE = 30 * 60 * 1000;

export type MessageSection = {
	sender?: User;
	messages: Message[];
	date?: Date;
};

export function useChat(
	server: BlahChatServerConnection,
	chatId: string
): {
	info: Readable<Chat>;
	messages: Readable<Message[]>;
	sectionedMessages: Readable<MessageSection[]>;
	sendMessage: (brt: BlahRichText) => Promise<void>;
} {
	const info = readable<Chat>(
		{ server: server.endpoint, id: chatId, name: '', type: 'group' },
		(set) => {
			server.fetchRoomInfo(chatId).then((room) => {
				set({ server: server.endpoint, id: chatId, name: room.title, type: 'group' });
			});
		}
	);

	const messages = readable<Message[]>([], (set, update) => {
		server
			.fetchRoomHistory(chatId)
			.then((history) =>
				update((messages) => [
					...history.map(messageFromBlah).toSorted((a, b) => a.date.getTime() - b.date.getTime()),
					...messages
				])
			);

		const { unsubscribe } = server.subscribeRoom(chatId, (message) => {
			update((messages) => [...messages, messageFromBlah(message)]);
		});

		return unsubscribe;
	});

	const sectionedMessages = derived([messages], ([messages]) => {
		const sections: MessageSection[] = [];

		let lastMessage: Message | undefined = messages[0];
		let currentSection: MessageSection = {
			messages: [],
			sender: lastMessage?.sender,
			date: lastMessage?.date
		};

		for (const message of messages) {
			const reachesMaxMessages = currentSection.messages.length >= MAX_MESSAGES_PER_SECTION;
			const senderChanged = message.sender.id !== lastMessage.sender.id;
			const silentForTooLong =
				message.date.getTime() - lastMessage.date.getTime() > SHOW_TIME_AFTER_SILENCE;
			if (reachesMaxMessages || senderChanged || silentForTooLong) {
				if (currentSection.messages.length > 0) {
					sections.push(currentSection);
				}
				currentSection = { messages: [], sender: message.sender };
				if (silentForTooLong) currentSection.date = message.date;
			}
			currentSection.messages.push(message);
			lastMessage = message;
		}

		sections.push(currentSection);

		return sections;
	});

	const sendMessage = async (brt: BlahRichText) => {
		try {
			await server.sendMessage(chatId, brt);
		} catch (e) {
			console.error(e);
			if (e instanceof BlahError && e.statusCode === 403) {
				await server.joinRoom(chatId);
				await server.sendMessage(chatId, brt);
			}
		}
	};

	return { info, messages, sectionedMessages, sendMessage };
}

import { readable, type Readable } from 'svelte/store';
import type { BlahChatServerConnection } from './blah/connection/chatServer';
import type { BlahRichText } from './richText';
import { messageFromBlah, type Chat, type Message } from './types';

export function useChat(
	server: BlahChatServerConnection,
	chatId: string
): {
	info: Readable<Chat>;
	messages: Readable<Message[]>;
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

	const sendMessage = async (brt: BlahRichText) => {
		await server.sendMessage(chatId, brt);
	};

	return { info, messages, sendMessage };
}

import { readable, writable, type Readable, type Writable } from 'svelte/store';
import { chatFromBlah, type Chat } from './types';
import type { BlahMessage, BlahRoomInfo } from './blah/structures';
import type { BlahSignedPayload } from './blah/crypto';

export class ChatListManager {
	chatList: Writable<Chat[]>;

	constructor() {
		this.chatList = writable<Chat[]>([]);
	}

	private sortChats(chatList: Chat[]) {
		chatList.sort(
			(a, b) =>
				(b.lastMessage?.date ?? new Date(1970, 0, 1)).getTime() ??
				-(a.lastMessage?.date ?? new Date(1970, 0, 1)).getTime()
		);
	}

	ingestChats(chats: BlahRoomInfo[], serverEndpoint: string) {
		this.chatList.update((chatList) => {
			for (const chat of chats) {
				const newChat = chatFromBlah(chat, serverEndpoint);

				const existing = chatList.find((c) => c.id === chat.ruuid);
				if (existing) {
					existing.name = newChat.name;
					existing.lastMessage = newChat.lastMessage ?? existing.lastMessage;
				} else {
					chatList.push(newChat);
					console.log('new chat added to list', newChat);
				}
			}

			this.sortChats(chatList);
			return chatList;
		});
	}

	ingestMessage(message: BlahSignedPayload<BlahMessage>, serverEndpoint: string) {
		this.chatList.update((chatList) => {
			const chat = chatList.find((c) => c.id === message.signee.payload.room);
			if (chat) {
				const newChat = chatFromBlah(
					{ ruuid: chat.id, title: chat.name, last_chat: message },
					serverEndpoint
				);
				chat.lastMessage = newChat.lastMessage ?? chat.lastMessage;
			}
			this.sortChats(chatList);
			return chatList;
		});
	}

	leaveChatServers(serverEndpoints: string[]) {
		this.chatList.update((chatList) => {
			return chatList.filter((chat) => serverEndpoints.includes(chat.server));
		});
	}
}

export function useChatList(manager: ChatListManager): Readable<Chat[]> {
	return readable<Chat[]>([], (set) => {
		const unsubscribe = manager.chatList.subscribe(set);
		return unsubscribe;
	});
}

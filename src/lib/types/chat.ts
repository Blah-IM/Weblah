import type { BlahRoomInfo } from '$lib/blah/structures';
import { messageFromBlah, type Message } from './message';

export type Chat = {
	server: string;
	id: string;
	name: string;
	profilePictureUrl?: string;
	type: 'group' | 'peer' | 'channel';
	lastMessage?: Message;
	unreadCount?: number;
};

export function chatFromBlah(room: BlahRoomInfo, serverEndpoint: string): Chat {
	return {
		server: serverEndpoint,
		id: room.ruuid,
		name: room.title,
		type: 'group',
		lastMessage: room.last_chat ? messageFromBlah(room.last_chat) : undefined
	};
}

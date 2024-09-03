import type { Message } from './message';

export type Chat = {
	server: string;
	id: string;
	name: string;
	profilePictureUrl?: string;
	type: 'group' | 'peer' | 'channel';
	lastMessage?: Message;
	unreadCount?: number;
};

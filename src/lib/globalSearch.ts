import type { BlahChatServerConnection } from './blah/connection/chatServer';
import { chatFromBlah, type Chat } from './types';

export class GlobalSearchManager {
	private connections: Map<string, BlahChatServerConnection>;

	constructor(connections: Map<string, BlahChatServerConnection>) {
		this.connections = connections;
	}

	public async searchChats(query: string): Promise<{ joined: Chat[]; public: Chat[] }> {
		let jobs: Promise<['joined' | 'public', Chat[]]>[] = [];

		for (const [endpoint, connection] of this.connections.entries()) {
			const fetchInJoinedRooms = async (): Promise<['joined' | 'public', Chat[]]> => [
				'joined',
				(await connection.fetchJoinedRooms()).map((r) => chatFromBlah(r, endpoint))
			];
			const fetchInPublicRooms = async (): Promise<['joined' | 'public', Chat[]]> => [
				'public',
				(await connection.discoverRooms()).map((r) => chatFromBlah(r, endpoint))
			];

			jobs = jobs.concat([fetchInJoinedRooms(), fetchInPublicRooms()]);
		}

		const results = await Promise.allSettled(jobs);
		console.log(results);

		const chats: { joined: Chat[]; public: Chat[] } = { joined: [], public: [] };
		for (const result of results) {
			console.log(result);

			if (result.status === 'rejected') continue;

			const [type, chatList] = result.value;
			for (const chat of chatList) {
				if (!chat.name.includes(query)) continue; // TODO: Actual backend search
				if (chats[type].find((c) => c.id === chat.id)) continue; // Dedupe in its own type
				if (type !== 'joined' && chats.joined.find((c) => c.id === chat.id)) continue; // If already in joined, don't add to public

				// Insert in last message date order
				const date = chat.lastMessage?.date;
				if (!date) {
					chats[type].push(chat);
					continue;
				}
				let idx = chats[type].findIndex((c) => (c.lastMessage ? c.lastMessage?.date < date : true));
				if (idx === -1) idx = 0;
				chats[type].splice(idx, 0, chat);
			}
		}

		return chats;
	}
}

import type { BlahRoomInfo, BlahUserJoinMessage } from '../structures';
import type { BlahChatServerConnection } from './chatServer';

export default class RoomManager {
	connection: BlahChatServerConnection;
	joinedRooms: BlahRoomInfo[] = $state([]);
	publicRooms: BlahRoomInfo[] = $state([]);

	constructor(connection: BlahChatServerConnection) {
		this.connection = connection;
	}

	async joinRoom(id: string): Promise<void> {
		const keypair = this.connection.keypair;
		if (!keypair) throw new Error('Must join with a keypair');

		const payload: BlahUserJoinMessage = {
			typ: 'add_member',
			room: id,
			permission: 1,
			user: keypair.id
		};

		await this.connection.apiCall('POST', `/room/${id}/admin`, payload);
	}

	private async fetchRoomList(filter: 'joined' | 'public'): Promise<BlahRoomInfo[]> {
		const { rooms }: { rooms: BlahRoomInfo[] } = await this.connection.apiCall(
			'GET',
			`/room?filter=${filter}`
		);
		return rooms;
	}

	async fetchJoinedRooms() {
		if (!this.connection.keypair) return [];
		this.joinedRooms = await this.fetchRoomList('joined');
	}

	async discoverRooms() {
		this.publicRooms = await this.fetchRoomList('public');
	}

	async updateRoomInfo(roomId: string) {
		const room: BlahRoomInfo = await this.connection.apiCall('GET', `/room/${roomId}`);
		const index = this.joinedRooms.findIndex((r) => r.rid === roomId);
		if (index !== -1) {
			this.joinedRooms[index] = room;
		} else {
			this.joinedRooms.push(room);
		}
	}
}

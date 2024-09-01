export type BlahUserJoinMessage = {
	room: string;
	typ: 'add_member';
	permission: 1;
	user: string;
};

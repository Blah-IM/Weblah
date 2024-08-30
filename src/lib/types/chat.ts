export type Chat = {
	id: string;
	name: string;
	profilePictureUrl?: string;
	type: 'group' | 'peer' | 'channel';
};

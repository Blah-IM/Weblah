import type { BlahSignedPayload } from '../crypto';
import type { BlahMessage } from './message';

export type BlahRoomInfo = {
	rid: string;
	title: string;
	last_chat?: BlahSignedPayload<BlahMessage>;
};

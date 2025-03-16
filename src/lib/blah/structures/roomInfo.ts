import type { BlahSignedPayload } from '@blah-im/core/crypto';
import type { BlahMessage } from './message';

export type BlahRoomInfo = {
	rid: string;
	title: string;
	last_chat?: BlahSignedPayload<BlahMessage>;
};

import type { BlahSignedPayload } from '@blah-im/core/crypto';
import type { BlahMessage } from '$lib/blah/structures';
import type { BlahRichText } from '$lib/richText';

export type Message = {
	id: string;
	sender: { id: string; name: string };
	content: BlahRichText;
	date: Date;
};

export function messageFromBlah(payload: BlahSignedPayload<BlahMessage>): Message {
	return {
		id: payload.sig,
		sender: {
			id: payload.signee.id_key,
			name: payload.signee.id_key.slice(0, 4) + '...' + payload.signee.id_key.slice(-4)
		},
		content: payload.signee.payload.rich_text,
		date: new Date(payload.signee.timestamp * 1000)
	};
}

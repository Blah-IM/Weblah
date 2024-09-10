import { generateName, type BlahSignedPayload } from '$lib/blah/crypto';
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
		sender: { id: payload.signee.user, name: generateName(payload.signee.user) },
		content: payload.signee.payload.rich_text,
		date: new Date(payload.signee.timestamp * 1000)
	};
}

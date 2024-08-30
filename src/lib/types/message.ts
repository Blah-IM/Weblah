import type { BlahRichText } from '$lib/richText';

export type Message = {
	id: string;
	sender: { id: string; name: string };
	content: BlahRichText;
	date: Date;
};

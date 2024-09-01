import type { BlahRichText } from '$lib/richText';

export type BlahMessage = {
	rich_text: BlahRichText;
	room: string;
	typ: 'chat';
};

import type { BlahRichText } from '@blah-im/core/richText';

export type BlahMessage = {
	rich_text: BlahRichText;
	room: string;
	typ: 'chat';
};

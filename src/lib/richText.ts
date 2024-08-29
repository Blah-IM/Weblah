import type { AttributeMap, Delta } from 'typewriter-editor';
import { z } from 'zod';

export const blahRichTextSpanAttributesSchema = z.object({
	b: z.boolean().default(false),
	i: z.boolean().default(false),
	u: z.boolean().default(false),
	s: z.boolean().default(false),
	m: z.boolean().default(false),
	hashtag: z.boolean().default(false),
	link: z.string().url().optional()
});
export type BlahRichTextSpanAttributes = z.input<typeof blahRichTextSpanAttributesSchema>;

export const blahRichTextSpanSchema = z.union([
	z.tuple([z.string()]),
	z.tuple([z.string(), blahRichTextSpanAttributesSchema])
]);
export type BlahRichTextSpan = z.input<typeof blahRichTextSpanSchema>;

export const blahRichTextBlockSchema = z.array(blahRichTextSpanSchema);
export type BlahRichTextBlock = z.input<typeof blahRichTextBlockSchema>;

export const blahRichTextSchema = z.array(blahRichTextBlockSchema);
export type BlahRichText = z.input<typeof blahRichTextSchema>;

function isObjectEmpty(obj: object) {
	for (const _ in obj) return false;
	return true;
}

function deltaAttributesToBlahRichTextSpanAttributes(
	attributes?: AttributeMap
): BlahRichTextSpanAttributes | null {
	if (!attributes) return null;

	const blahRichTextSpanAttributes: BlahRichTextSpanAttributes = {};

	if (attributes.bold) blahRichTextSpanAttributes.b = true;
	if (attributes.italic) blahRichTextSpanAttributes.i = true;
	if (attributes.code) blahRichTextSpanAttributes.m = true;
	if (attributes.link) blahRichTextSpanAttributes.link = attributes.link;

	if (attributes.underline) blahRichTextSpanAttributes.u = true;
	if (attributes.strike) blahRichTextSpanAttributes.s = true;

	return isObjectEmpty(blahRichTextSpanAttributes) ? null : blahRichTextSpanAttributes;
}

export function deltaToBlahRichText(delta: Delta): BlahRichText {
	const blocks: BlahRichText = [];

	let block: BlahRichTextBlock = [];
	for (const op of delta.ops) {
		const lines = op.insert?.split('\n');
		if (!lines) continue;
		const attributes = deltaAttributesToBlahRichTextSpanAttributes(op.attributes);

		const line = lines.shift();
		block.push(attributes ? [line, attributes] : [line]);

		for (const line of lines) {
			blocks.push(block);
			block = [];
			block.push(attributes ? [line, attributes] : [line]);
		}
	}

	return blocks;
}

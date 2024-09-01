import canonicalize from 'canonicalize';
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
	z.string(),
	z.tuple([z.string(), blahRichTextSpanAttributesSchema])
]);
export type BlahRichTextSpan = z.input<typeof blahRichTextSpanSchema>;

export const blahRichTextSchema = z.array(blahRichTextSpanSchema);
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
	if (attributes.strikethrough) blahRichTextSpanAttributes.s = true;

	return isObjectEmpty(blahRichTextSpanAttributes) ? null : blahRichTextSpanAttributes;
}

export function deltaToBlahRichText(delta: Delta): BlahRichText {
	const spans: BlahRichText = [];

	let lastText = '';
	let lastAttributes: BlahRichTextSpanAttributes | null = null;
	let canonicalizedLastAttributes: string = 'null';

	function commitSpan() {
		spans.push(lastAttributes === null ? lastText : [lastText, lastAttributes]);
	}

	for (const op of delta.ops) {
		// Not sure in what cases op.insert would not be a string, but let's be safe
		if (typeof op.insert !== 'string') continue;

		const attributes = deltaAttributesToBlahRichTextSpanAttributes(op.attributes);
		const canonicalizedAttributes = canonicalize(attributes) ?? 'null';

		if (canonicalizedAttributes === canonicalizedLastAttributes) {
			lastText += op.insert;
			continue;
		}

		commitSpan();
		lastText = op.insert;
		lastAttributes = attributes;
		canonicalizedLastAttributes = canonicalizedAttributes;
	}
	commitSpan();

	return spans;
}

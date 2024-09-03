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

export function deltaToBlahRichText(delta: Delta, trim?: boolean = true): BlahRichText {
	const spans: BlahRichText = [];

	let lastText = '';
	let lastAttributes: BlahRichTextSpanAttributes | null = null;
	let canonicalizedLastAttributes: string = 'null';

	function commitSpan(trim?: 'start' | 'end'): boolean {
		const trimmedLastText =
			trim === 'start' ? lastText.trimStart() : trim === 'end' ? lastText.trimEnd() : lastText;
		if (trimmedLastText === '') return false;
		spans.push(lastAttributes === null ? trimmedLastText : [trimmedLastText, lastAttributes]);
		return true;
	}

	let isFirstSpan = true;
	for (const op of delta.ops) {
		// Not sure in what cases op.insert would not be a string, but let's be safe
		if (typeof op.insert !== 'string') continue;

		const attributes = deltaAttributesToBlahRichTextSpanAttributes(op.attributes);
		const canonicalizedAttributes = canonicalize(attributes) ?? 'null';

		if (canonicalizedAttributes === canonicalizedLastAttributes) {
			lastText += op.insert;
			continue;
		}

		const commited = commitSpan(trim && isFirstSpan ? 'start' : undefined);
		if (commited) isFirstSpan = false;

		lastText = op.insert;
		lastAttributes = attributes;
		canonicalizedLastAttributes = canonicalizedAttributes;
	}
	const lastCommited = commitSpan(trim ? 'end' : undefined);
	if (trim && !lastCommited) {
		// The last segment is empty, so we need to trim the one before it
		let lastSpan = spans.pop();
		if (!lastSpan) return spans;

		if (typeof lastSpan === 'string') {
			lastSpan = lastSpan.trimEnd();
			if (lastSpan !== '') spans.push(lastSpan);
		} else {
			lastSpan[0] = lastSpan[0].trimEnd();
			if (lastSpan[0] !== '') spans.push(lastSpan);
		}
	}

	return spans;
}

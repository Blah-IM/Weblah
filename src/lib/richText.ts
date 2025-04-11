import type { BlahRichText, BlahRichTextSpanAttributes } from '@blah-im/core/richText';
import type { Node } from 'prosemirror-model';

function isObjectEmpty(obj: object) {
	for (const _ in obj) return false;
	return true;
}

export function proseMirrorDocToBlahRichText(doc: Node): BlahRichText {
	const spans: BlahRichText = [];
	for (const paragraph of doc.content.content) {
		if (!paragraph.type.isBlock) continue;

		for (const inline of paragraph.content.content) {
			if (!inline.type.isText) continue;

			const text = inline.text ?? '';
			const attributes: BlahRichTextSpanAttributes = {};
			const marks = inline.marks ?? [];
			for (const mark of marks) {
				switch (mark.type.name) {
					case 'strong':
						attributes.b = true;
						break;
					case 'em':
						attributes.i = true;
						break;
					case 'code':
						attributes.m = true;
						break;
					case 'link':
						attributes.link = mark.attrs.href;
						break;
					case 'underline':
						attributes.u = true;
						break;
					case 'strikethrough':
						attributes.s = true;
						break;
					case 'tag':
						attributes.tag = true;
						break;
					case 'spoiler':
						attributes.spoiler = true;
						break;
				}
			}
			if (isObjectEmpty(attributes)) {
				spans.push(text);
			} else {
				spans.push([text, attributes]);
			}
		}

		// TODO: Proper multi-paragraph support
		spans.push('\n');
	}

	return spans;
}

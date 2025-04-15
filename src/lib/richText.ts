import type { BlahRichText, BlahRichTextSpanAttributes } from '@blah-im/core/richText';
import type { Node, Schema } from 'prosemirror-model';

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

export function blahRichTextToProseMirrorDoc(richText: BlahRichText, schema: Schema): Node {
	console.log(schema);
	const paragraphs = richText.flatMap((span) => {
		if (typeof span === 'string') {
			if (!span.trim().length) return [];
			return [schema.nodes.paragraph.create({}, schema.text(span))];
		} else {
			const [text, attributes] = span;
			const marks = [];
			if (attributes.b) marks.push(schema.marks.strong.create());
			if (attributes.i) marks.push(schema.marks.em.create());
			if (attributes.m) marks.push(schema.marks.code.create());
			if (attributes.link) marks.push(schema.marks.link.create({ href: attributes.link }));
			if (attributes.u) marks.push(schema.marks.underline.create());
			if (attributes.s) marks.push(schema.marks.strikethrough.create());
			if (attributes.tag) marks.push(schema.marks.tag.create());
			if (attributes.spoiler) marks.push(schema.marks.spoiler.create());

			return [schema.nodes.paragraph.create({}, schema.text(text, marks))];
		}
	});

	return schema.nodes.doc.create({}, paragraphs);
}

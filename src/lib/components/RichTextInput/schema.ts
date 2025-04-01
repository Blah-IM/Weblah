import { Schema } from 'prosemirror-model';
import { nodes as basicNodes, marks as basicMarks } from 'prosemirror-schema-basic';

export const messageSchema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragragh: {
			content: 'inline*'
		},
		text: basicNodes.text
	},
	marks: {
		...basicMarks,
		underline: {
			parseDOM: [{ tag: 'u' }],
			toDOM: () => ['u', 0]
		},
		strikethrough: {
			parseDOM: [{ tag: 's' }],
			toDOM: () => ['s', 0]
		},
		tag: {
			parseDOM: [{ tag: 'span[data-weblah-tag]' }],
			toDOM: () => ['span', { 'data-weblah-richtext-tag': true }, 0]
		},
		spoiler: {
			parseDOM: [{ tag: 'span[data-weblah-spoiler]' }],
			toDOM: () => ['span', { 'data-weblah-richtext-spoiler': true }, 0]
		}
	}
});

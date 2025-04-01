import { EditorState } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { messageSchema } from './schema';

export function createMessageEditorState() {
	const state = EditorState.create({
		schema: messageSchema,
		plugins: [
			history(),
			keymap({
				'Mod-z': undo,
				'Mod-y': redo,
				'Mod-Shift-z': redo
			}),
			keymap(baseKeymap)
		]
	});

	return state;
}

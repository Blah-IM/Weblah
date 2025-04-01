import { EditorState, type Command } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import type { Schema } from 'prosemirror-model';

import { messageSchema } from './schema';

export type EditorConfiguration = {
	keyboardSubmitMethod?: 'enter' | 'shiftEnter' | undefined;
	onKeyboardSubmit?: () => void;
};

export function createEditorState(
	{ keyboardSubmitMethod, onKeyboardSubmit }: EditorConfiguration,
	schema: Schema = messageSchema
) {
	const submitCommand: Command = () => {
		onKeyboardSubmit?.();
		return true;
	};
	const newlineCommand: Command = baseKeymap.Enter;

	const submitOrNewlineKeyMap: Record<string, Command> = {};

	if (keyboardSubmitMethod === 'enter') {
		submitOrNewlineKeyMap['Enter'] = submitCommand;
		submitOrNewlineKeyMap['Shift-Enter'] = newlineCommand;
	} else if (keyboardSubmitMethod === 'shiftEnter') {
		submitOrNewlineKeyMap['Enter'] = newlineCommand;
		submitOrNewlineKeyMap['Shift-Enter'] = submitCommand;
	}

	const state = EditorState.create({
		schema,
		plugins: [
			history(),
			keymap({
				'Mod-z': undo,
				'Mod-y': redo,
				'Mod-Shift-z': redo
			}),
			keymap({ ...baseKeymap, ...submitOrNewlineKeyMap })
		]
	});

	return state;
}

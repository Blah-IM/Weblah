import { EditorState, type Command } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import type { Schema, Node } from 'prosemirror-model';

export type EditorStateConfiguration = {
	initialDoc?: Node | string;
	schema: Schema;
	keyboardSubmitMethod?: 'enter' | 'shiftEnter' | undefined;
	onKeyboardSubmit?: (doc: Node) => void;
};

export function createProseMirrorEditorState({
	keyboardSubmitMethod,
	onKeyboardSubmit,
	initialDoc,
	schema
}: EditorStateConfiguration) {
	const submitCommand: Command = (state) => {
		onKeyboardSubmit?.(state.doc);
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
		doc: typeof initialDoc === 'string' ? schema.text(initialDoc) : initialDoc,
		schema,
		plugins: [
			history(),
			keymap({
				'Mod-z': undo,
				'Mod-y': redo,
				'Mod-Shift-z': redo,
				...baseKeymap,
				...submitOrNewlineKeyMap
			})
		]
	});

	return state;
}

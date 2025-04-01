import { DOMParser, Node, Schema } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import { createEditorState, type EditorConfiguration } from './editorState';

export class RichTextEditState {
	state: EditorState;
	doc: Node | undefined = $state();
	plainText = $state('');

	constructor(
		config: EditorConfiguration,
		schema?: Schema,
		initialNodeOrPlainText?: Node | string
	) {
		if (initialNodeOrPlainText) {
			if (typeof initialNodeOrPlainText === 'string') {
				this.plainText = initialNodeOrPlainText;
			} else {
				this.doc = initialNodeOrPlainText;
			}
		}

		this.state = createEditorState(config, schema);
	}
}

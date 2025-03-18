<script lang="ts">
	import { Delta, Editor, asRoot, h } from 'typewriter-editor';
	import { keyboardSubmit } from './keyboardSubmitModule';

	interface Props {
		delta?: Delta;
		editor?: Editor;
		plainText?: string | undefined;
		placeholder?: string;
		keyboardSubmitMethod?: 'enter' | 'shiftEnter' | undefined;
		onKeyboardSubmit?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		delta = $bindable(new Delta()),
		editor = $bindable(initEditor()),
		plainText = $bindable(undefined),
		placeholder = '',
		keyboardSubmitMethod = undefined,
		onKeyboardSubmit,
		children
	}: Props = $props();

	function initEditor() {
		const modules = keyboardSubmitMethod
			? {
					keyboardSubmit: keyboardSubmit(
						() => onKeyboardSubmit && onKeyboardSubmit(),
						keyboardSubmitMethod
					)
				}
			: undefined;
		const editor = new Editor({ modules });
		editor.typeset.formats.add({
			name: 'underline',
			selector: 'span[data-weblah-brt=underline]',
			styleSelector: '[style*="text-decoration:underline"], [style*="text-decoration: underline"]',
			commands: (editor) => () => editor.toggleTextFormat({ underline: true }),
			shortcuts: 'Mod+U',
			render: (attributes, children) => h('span', { 'data-weblah-brt': 'underline' }, children)
		});
		editor.typeset.formats.add({
			name: 'strikethrough',
			selector: 's',
			styleSelector:
				'[style*="text-decoration:line-through"], [style*="text-decoration: line-through"]',
			commands: (editor) => () => editor.toggleTextFormat({ strikethrough: true }),
			shortcuts: 'Mod+Shift+X',
			render: (attributes, children) => h('s', null, children)
		});

		editor.on('change', () => {
			delta = editor.getDelta();
			if (typeof plainText === 'string') plainText = editor.getText();
		});

		return editor;
	}

	$effect.pre(() => {
		if (keyboardSubmitMethod || typeof keyboardSubmitMethod === 'undefined') editor = initEditor();
	});

	$effect.pre(() => {
		editor.setDelta(delta ?? new Delta());
	});
	$effect.pre(() => {
		if (typeof plainText === 'string' && plainText !== editor.getText()) editor.setText(plainText);
	});
</script>

<div
	class="rich-text relative w-full outline-hidden before:absolute before:hidden before:leading-tight before:opacity-50 before:content-[attr(data-weblah-placeholder)] data-weblah-is-empty:before:block"
	use:asRoot={editor}
	data-weblah-is-empty={!delta || (delta.ops.length === 1 && delta.ops[0].insert === '\n')
		? 'true'
		: undefined}
	data-weblah-placeholder={placeholder}
	role="textbox"
	tabindex="0"
>
	{@render children?.()}
</div>

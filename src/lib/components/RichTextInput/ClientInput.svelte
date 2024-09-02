<script lang="ts">
	import { Delta, Editor, asRoot, h } from 'typewriter-editor';

	export let delta: Delta = new Delta();
	export let plainText: string | undefined = undefined;
	export let placeholder: string = '';

	const editor = new Editor();
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

	$: editor.setDelta(delta ?? new Delta());
	$: if (typeof plainText === 'string' && plainText !== editor.getText()) editor.setText(plainText);
</script>

<div
	class="rich-text relative w-full outline-none before:absolute before:hidden before:leading-tight before:opacity-50 before:content-[attr(data-weblah-placeholder)] data-[weblah-is-empty]:before:block"
	use:asRoot={editor}
	data-weblah-is-empty={!delta || (delta.ops.length === 1 && delta.ops[0].insert === '\n')
		? 'true'
		: undefined}
	data-weblah-placeholder={placeholder}
	on:keydown
	role="textbox"
	tabindex="0"
>
	<slot />
</div>

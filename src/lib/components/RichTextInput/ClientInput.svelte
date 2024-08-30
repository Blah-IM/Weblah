<script lang="ts">
	import { Delta, Editor, asRoot } from 'typewriter-editor';

	export let delta: Delta = new Delta();
	export let placeholder: string = '';

	const editor = new Editor();
	delta = editor.getDelta();
	editor.on('change', () => {
		delta = editor.getDelta();
	});

	$: editor.setDelta(delta);
</script>

<div
	class="rich-text relative w-full outline-none before:absolute before:hidden before:leading-tight before:opacity-50 before:content-[attr(data-weblah-placeholder)] data-[weblah-is-empty]:before:block"
	use:asRoot={editor}
	data-weblah-is-empty={!delta || (delta.ops.length === 1 && delta.ops[0].insert === '\n')
		? 'true'
		: undefined}
	data-weblah-placeholder={placeholder}
>
	<slot />
</div>

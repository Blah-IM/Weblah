<script lang="ts">
	import InputFrame from '$lib/components/InputFrame.svelte';
	import { tw } from '$lib/tw';
	import { Delta, Editor, asRoot } from 'typewriter-editor';

	let className = '';
	export { className as class };

	export let delta: Delta;

	const editor = new Editor();
	delta = editor.getDelta();
	editor.on('change', () => {
		delta = editor.getDelta();
	});

	$: editor.setDelta(delta);
</script>

<InputFrame class={tw('overflow-y-auto', className)}>
	<div class="rich-text w-full outline-none" use:asRoot={editor}>
		<slot />
	</div>
</InputFrame>

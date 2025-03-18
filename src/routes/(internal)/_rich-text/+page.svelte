<script lang="ts">
	import RichTextInput from '$lib/components/RichTextInput.svelte';
	import { deltaToBlahRichText } from '$lib/richText';
	import type { Delta } from 'typewriter-editor';

	let delta: Delta | undefined = $state();

	let brt = $derived(delta ? deltaToBlahRichText(delta) : null);
</script>

<RichTextInput bind:delta class="m-4 max-h-32">
	<p>A <strong>quick</strong> brown <em>fox</em> jumps over the lazy dog.</p>
	<p>A test engineer <a href="https://example.com">tests</a> the <code>RichTextInput</code>.</p>
</RichTextInput>

<div class="flex min-h-0 flex-1 gap-4 p-4">
	<div class="flex min-h-0 flex-1 flex-col">
		<h2 class="text-lg">Delta (Editor's internal representation)</h2>
		<div class="min-h-0 flex-1 overflow-auto select-text">
			<pre><code>{JSON.stringify(delta, null, 2)}</code></pre>
		</div>
	</div>

	<div class="flex min-h-0 flex-1 flex-col">
		<h2 class="text-lg">Blah Rich Text</h2>
		<div class="min-h-0 flex-1 overflow-auto select-text">
			<pre><code>{JSON.stringify(brt, null, 2)}</code></pre>
		</div>
	</div>
</div>

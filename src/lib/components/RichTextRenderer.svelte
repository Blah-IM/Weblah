<script lang="ts">
	import type { BlahRichText } from '$lib/richText';
	import { tw } from '$lib/tw';
	import RichTextSpan from './RichTextRenderer/RichTextSpan.svelte';

	export let content: BlahRichText;
	let className = '';
	export { className as class };
</script>

<div class={tw('rich-text', className)}>
	{#each content as block}
		<p>
			{#each block as span}
				{#if typeof span === 'string'}
					{#if span === ''}
						<br />
					{:else}
						{span}
					{/if}
				{:else}
					{@const [text, attributes] = span}
					<RichTextSpan {text} {attributes} />
				{/if}
			{/each}
		</p>
	{/each}
</div>

<script lang="ts">
	import type { BlahRichText } from '$lib/richText';
	import { tw } from '$lib/tw';
	import RichTextSpan from './RichTextRenderer/RichTextSpan.svelte';
	import PlainTextRenderer from './RichTextRenderer/PlainTextRenderer.svelte';

	export let content: BlahRichText;
	let className = '';
	export { className as class };
</script>

<div class={tw('rich-text', className)}>
	<p>
		{#each content as span}
			{#if typeof span === 'string'}
				<PlainTextRenderer text={span} />
			{:else}
				{@const [text, attributes] = span}
				<RichTextSpan {text} {attributes} />
			{/if}
		{/each}
	</p>
</div>

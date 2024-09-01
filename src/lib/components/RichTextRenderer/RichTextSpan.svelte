<script lang="ts">
	import type { BlahRichTextSpanAttributes } from '$lib/richText';
	import PlainTextRenderer from './PlainTextRenderer.svelte';

	// From outside to inside, better align this with the RichTextInput
	const renderOrder: (keyof BlahRichTextSpanAttributes)[] = [
		'link',
		'hashtag',
		'b',
		'i',
		'm',
		'u',
		's'
	];

	const tagMap: Partial<Record<keyof BlahRichTextSpanAttributes, string>> = {
		s: 's',
		b: 'strong',
		i: 'em',
		m: 'code'
	};

	const dataAttributeBrtMap: Partial<Record<keyof BlahRichTextSpanAttributes, string>> = {
		u: 'underline'
	};

	export let text: string;
	export let attributes: BlahRichTextSpanAttributes;
	export let attribute: keyof BlahRichTextSpanAttributes | '' = renderOrder[0];

	const nextAttribute = attribute ? (renderOrder[renderOrder.indexOf(attribute) + 1] ?? '') : null;
</script>

{#if attribute === ''}
	<PlainTextRenderer {text} />
{:else if !attributes[attribute]}
	<svelte:self {...$$props} attribute={nextAttribute} />
{:else if attribute === 'link'}
	<a href={attributes.link} target="_blank">
		<svelte:self {...$$props} attribute={nextAttribute} />
	</a>
{:else if attribute === 'hashtag'}
	<a href={`/search?q=${encodeURIComponent(text)}`}>
		<svelte:self {...$$props} attribute={nextAttribute} />
	</a>
{:else if tagMap[attribute]}
	<svelte:element this={tagMap[attribute]}>
		<svelte:self {...$$props} attribute={nextAttribute} />
	</svelte:element>
{:else if dataAttributeBrtMap[attribute]}
	<span data-weblah-brt={dataAttributeBrtMap[attribute]}>
		<svelte:self {...$$props} attribute={nextAttribute} />
	</span>
{:else}
	<svelte:self {...$$props} attribute={nextAttribute} />
{/if}

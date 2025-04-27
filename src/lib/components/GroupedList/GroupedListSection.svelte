<script lang="ts">
	import Card from '../Card.svelte';

	interface Props {
		header?: import('svelte').Snippet | string;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet | string;
	}

	let { header, children, footer }: Props = $props();
</script>

<section class="my-6 cursor-default px-4">
	{#if header}
		<h3 class="text-sf-tertiary mb-1 truncate px-4 text-sm font-medium uppercase">
			{#if typeof header === 'string'}
				{header}
			{:else}
				{@render header?.()}
			{/if}
		</h3>
	{/if}
	<Card class="divide-ss-secondary divide-y-[0.5px]">
		{@render children?.()}
	</Card>
	{#if footer}
		<div class="text-sf-tertiary mt-1 px-4 text-sm">
			{#if typeof footer === 'string'}
				{footer}
			{:else}
				{@render footer?.()}
			{/if}
		</div>
	{/if}
</section>

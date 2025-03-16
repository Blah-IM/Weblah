<script lang="ts">
	interface Props {
		header?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { header, children, footer }: Props = $props();
</script>

<section class="my-6 cursor-default px-4">
	{#if header}
		<h3 class="mb-1 truncate px-4 text-sm font-medium uppercase text-sf-tertiary">
			{@render header?.()}
		</h3>
	{/if}
	<div
		class="divide-y-[0.5px] divide-ss-secondary overflow-hidden rounded-lg border-[0.5px] border-ss-secondary bg-sb-primary shadow-xs"
	>
		{@render children?.()}
	</div>
	{#if footer}
		<div class="mt-1 px-4 text-sm text-sf-tertiary">
			{@render footer?.()}
		</div>
	{/if}
</section>

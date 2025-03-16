<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		variant?: 'primary' | 'secondary';
		class?: string | null;
		href?: string | null;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		variant = 'secondary',
		class: className = '',
		href = null,
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	class={tw(
		'text-sf-secondary ring-ss-secondary inline-flex cursor-default items-center justify-center rounded-md px-2 py-1 shadow-xs ring-1',
		'hover:ring-ss-primary font-normal transition-shadow duration-200 active:shadow-inner',
		variant === 'primary' && [
			'relative text-slate-50 ring-0 duration-200',
			'before:absolute before:-inset-px before:rounded-[7px]',
			'before:from-accent-400 before:to-accent-500 before:bg-linear-to-b before:from-40% before:ring-1 before:ring-black/10 before:ring-inset',
			'dark:before:from-accent-500 dark:before:to-accent-600 before:transition-shadow active:before:shadow-inner'
		],
		className
	)}
	role="button"
	tabindex="0"
	{...rest}
>
	{#if variant === 'primary'}
		<div class="z-10 drop-shadow-[0_-1px_0_--theme(--color-black/0.2)]">{@render children?.()}</div>
	{:else}
		{@render children?.()}
	{/if}
</svelte:element>

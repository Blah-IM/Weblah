<script lang="ts">
	import { tw } from '$lib/tw';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		variant?: 'primary' | 'secondary';
		class?: string;
		children?: import('svelte').Snippet;
	} & Omit<
		({ href: string } & HTMLAnchorAttributes) | ({ href?: undefined } & HTMLButtonAttributes),
		'class'
	>;

	let { variant = 'secondary', class: externalClass, children, ...rest }: Props = $props();

	const className = $derived(
		tw(
			'text-sf-secondary bg-sb-primary inset-ring-ss-secondary inline-flex cursor-default items-center justify-center rounded-md px-2.5 py-1 shadow-xs inset-ring',
			'hover:ring-ss-primary font-normal transition-shadow duration-200 active:shadow-inner',
			variant === 'primary' && [
				'relative text-slate-50 ring-0 duration-200',
				'before:absolute before:-inset-px before:rounded-[7px]',
				'before:from-accent-400 before:to-accent-500 before:bg-linear-to-b before:from-40% before:ring-1 before:ring-black/10 before:ring-inset',
				'dark:before:from-accent-600 dark:before:to-accent-700 before:transition-shadow active:before:shadow-inner'
			],
			externalClass
		)
	);
</script>

{#snippet content()}
	{#if variant === 'primary'}
		<div class="z-10 drop-shadow-[0_-1px_0_--theme(--color-black/0.2)]">{@render children?.()}</div>
	{:else}
		{@render children?.()}
	{/if}
{/snippet}

{#if 'href' in rest}
	<a class={className} {...rest}>{@render content()}</a>
{:else}
	<button class={className} {...rest}>{@render content()}</button>
{/if}

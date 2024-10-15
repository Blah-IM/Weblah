<script lang="ts">
	import { tw } from '$lib/tw';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type HTMLButtonOrAnchorAttributes = Partial<HTMLAnchorAttributes> & Partial<HTMLButtonAttributes>;

	interface $$Props extends HTMLButtonOrAnchorAttributes {
		variant?: 'primary' | 'secondary';
	}

	export let variant: $$Props['variant'] = 'secondary';
	let className: string | null = '';
	export { className as class };

	export let href: string | null = null;
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	class={tw(
		'inline-flex cursor-default items-center justify-center rounded-md px-2 py-1 text-sf-secondary shadow-sm ring-1 ring-ss-secondary',
		'font-normal transition-shadow duration-200 hover:ring-ss-primary active:shadow-inner',
		variant === 'primary' && [
			'relative text-slate-50 ring-0 duration-200',
			'before:absolute before:-inset-px before:rounded-[7px]',
			'before:bg-gradient-to-b before:from-accent-400 before:from-40% before:to-accent-500 before:ring-1 before:ring-inset before:ring-black/10',
			'before:transition-shadow active:before:shadow-inner dark:before:from-accent-500 dark:before:to-accent-600'
		],
		className
	)}
	{...$$restProps}
	on:click
	role="button"
	tabindex="0"
>
	{#if variant === 'primary'}
		<div class="z-10 drop-shadow-[0_-1px_0_theme(colors.black/0.2)]"><slot /></div>
	{:else}
		<slot />
	{/if}
</svelte:element>

<script lang="ts">
	import { tw } from '$lib/tw';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type HTMLButtonOrAnchorAttributes = Partial<HTMLAnchorAttributes> & Partial<HTMLButtonAttributes>;

	interface $$Props extends HTMLButtonOrAnchorAttributes {}

	let className: string | null = '';
	export { className as class };

	export let href: string | null = null;
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	class={tw(
		'inline-flex cursor-default items-center justify-center rounded-md px-2 py-1 text-sf-secondary shadow-sm ring-1 ring-ss-secondary transition-shadow duration-200 hover:ring-ss-primary active:shadow-inner',
		className
	)}
	{...$$restProps}
	on:click
	role="button"
	tabindex="0"
>
	<slot />
</svelte:element>

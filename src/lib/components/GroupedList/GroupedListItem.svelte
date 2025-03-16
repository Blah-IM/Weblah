<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { tw } from '$lib/tw';
	import { Icon, type IconSource } from 'svelte-hero-icons';

	interface Props {
		href?: string | undefined;
		icon?: IconSource | undefined;
		selected?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		href = undefined,
		icon = undefined,
		selected = false,
		children
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	class={tw(
		'flex w-full cursor-default items-center gap-2 px-4 py-3 font-medium text-sf-primary first:rounded-t-lg last:rounded-b-lg',
		selected && 'bg-accent-500 text-white shadow-inner dark:bg-accent-900 dark:text-sf-primary'
	)}
	tabindex="0"
	role="button"
	onclick={bubble('click')}
>
	{#if icon}
		<Icon
			src={icon}
			class={tw('size-5 text-sf-secondary', selected && 'text-white dark:text-sf-primary')}
			mini
		/>
	{/if}
	{@render children?.()}
</svelte:element>

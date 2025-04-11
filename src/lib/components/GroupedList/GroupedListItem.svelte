<script lang="ts">
	import { tw } from '$lib/tw';
	import { Icon, type IconSource } from 'svelte-hero-icons';

	interface Props {
		href?: string | undefined;
		icon?: IconSource | undefined;
		selected?: boolean;
		children?: import('svelte').Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let { href = undefined, icon = undefined, selected = false, children, onclick }: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	class={tw(
		'text-sf-primary flex w-full cursor-default items-center gap-2 px-4 py-3 font-medium first:rounded-t-lg last:rounded-b-lg',
		selected && 'bg-accent-500 dark:bg-accent-900 dark:text-sf-primary text-white shadow-inner'
	)}
	tabindex="0"
	role="button"
	{onclick}
>
	{#if icon}
		<Icon
			src={icon}
			class={tw('text-sf-secondary size-5 shrink-0', selected && 'dark:text-sf-primary text-white')}
			mini
		/>
	{/if}
	<div class="min-w-0 truncate text-start">
		{@render children?.()}
	</div>
</svelte:element>

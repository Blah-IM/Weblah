<script lang="ts">
	import type { DropdownMenuRadioItemProps } from 'bits-ui';
	import { DropdownMenu } from 'bits-ui';
	import { Check, Icon } from 'svelte-hero-icons';

	interface Props extends DropdownMenuRadioItemProps {
		children?: import('svelte').Snippet;
	}

	let { children: componentChildren, ...props }: Props = $props();
</script>

<DropdownMenu.RadioItem
	class="text-sf-primary hover:bg-accent-50 flex cursor-default items-center gap-1 rounded-sm px-1.5 py-0.5 transition-colors duration-200 dark:hover:bg-white/5"
	{...props}
>
	{#snippet children(itemProps)}
		{#if itemProps.checked}
			<Icon src={Check} class="size-full" micro />
		{/if}
		{@render componentChildren?.()}
	{/snippet}
</DropdownMenu.RadioItem>

<script lang="ts">
	import { tw } from '$lib/tw';
	import { DropdownMenu, type DropdownMenuContentProps } from 'bits-ui';
	import { expoOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	interface Props extends DropdownMenuContentProps {
		class?: string;
	}

	let { class: className = '', children, ...rest }: Props = $props();

	const fullClassName = tw(
		'group border-ss-secondary bg-sb-overlay min-w-32 origin-top rounded-lg border p-1 shadow-lg',
		className
	);
</script>

<DropdownMenu.Content class={fullClassName} sideOffset={4} forceMount {...rest}>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:scale={{ start: 0.96, duration: 300, easing: expoOut }}>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</DropdownMenu.Content>

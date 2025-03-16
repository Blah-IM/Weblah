<script lang="ts">
	import { tw } from '$lib/tw';
	import { DropdownMenu, type DropdownMenuContentProps } from 'bits-ui';
	import { expoOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	
	interface Props {
		class?: $$Props['class'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = '', children, ...rest }: Props = $props();
	
</script>

<DropdownMenu.Content
	class={tw(
		'group min-w-32 origin-top rounded-lg border border-ss-secondary bg-sb-overlay p-1 shadow-lg',
		className
	)}
	sideOffset={4}
	transition={scale}
	transitionConfig={{ start: 0.96, duration: 300, easing: expoOut }}
	{...rest}
>
	{@render children?.()}
</DropdownMenu.Content>

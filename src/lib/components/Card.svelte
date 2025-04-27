<script lang="ts">
	import { tw } from '$lib/tw';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { children, class: classNames, ...rest }: Props = $props();
</script>

<div
	class={tw(
		'border-ss-secondary bg-sb-primary overflow-hidden rounded-lg border-[0.5px] shadow-xs',
		classNames
	)}
	{...rest}
>
	{@render children?.()}
</div>

<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
	
</script>

<div
	class={tw(
		'backdrop mx-4 inline-block cursor-default rounded-full px-2 py-0.5 text-center text-sm text-sf-secondary backdrop-blur-xs',
		className
	)}
>
	{@render children?.()}
</div>

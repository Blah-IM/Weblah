<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
	
</script>

<header
	class={tw(
		'flex min-h-[calc(3rem+1px)] cursor-default items-center border-b border-ss-secondary bg-sb-primary p-2 text-center font-semibold text-sf-primary shadow-xs',
		className
	)}
>
	{@render children?.()}
</header>

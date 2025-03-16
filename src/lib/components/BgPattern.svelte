<script lang="ts">
	import { tw } from '$lib/tw';
	import { patterns, type PatternName } from './BgPattern';


	interface Props {
		pattern?: PatternName;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { pattern = 'rain', class: className = '', children }: Props = $props();
	
</script>

<div
	class={tw(
		'pattern-container relative before:absolute before:inset-0 before:size-full before:bg-black/5 before:[mask-image:var(--pattern-image)] dark:before:bg-white/5',
		className
	)}
	style:--pattern-image={`url("${patterns[pattern]}")`}
>
	{@render children?.()}
</div>

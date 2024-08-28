<script lang="ts">
	import { tw } from '$lib/tw';
	import { patterns, type PatternName } from './BgPattern';

	export let pattern: PatternName = 'rain';

	let className: string = '';
	export { className as class };
</script>

<div
	class={tw(
		'pattern-container relative before:absolute before:inset-0 before:size-full before:bg-black/5 before:[mask-image:var(--pattern-image)] dark:before:bg-white/5',
		className
	)}
	style:--pattern-image={`url("${patterns[pattern]}")`}
>
	<slot />
</div>

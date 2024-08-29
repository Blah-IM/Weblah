<script lang="ts">
	import { tw } from '$lib/tw';

	let className = '';
	export { className as class };
</script>

<div
	class={tw(
		'flex items-center gap-1 rounded-md px-2 py-1.5 shadow-[inset_0_1px_2px_0_rgb(0_0_0/0.05)] ring-1 ring-ss-secondary',
		className
	)}
>
	<slot />
</div>

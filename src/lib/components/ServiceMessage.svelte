<script lang="ts">
	import { tw } from '$lib/tw';

	let className: string = '';
	export { className as class };
</script>

<div
	class={tw(
		'backdrop mx-4 inline-block cursor-default rounded-full px-2 py-0.5 text-center text-sm text-sf-secondary backdrop-blur-sm',
		className
	)}
>
	<slot />
</div>

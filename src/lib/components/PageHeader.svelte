<script lang="ts">
	import { tw } from '$lib/tw';

	let className = '';
	export { className as class };
</script>

<header
	class={tw(
		'flex min-h-[calc(3rem+1px)] cursor-default items-center border-b border-ss-secondary bg-sb-primary p-2 text-center font-semibold text-sf-primary shadow-sm',
		className
	)}
>
	<slot />
</header>

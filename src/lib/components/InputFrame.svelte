<script lang="ts">
	import { tw } from '$lib/tw';

	let className = '';
	export { className as class };
</script>

<label
	class={tw(
		'flex items-center gap-1 rounded-md bg-sb-primary px-2 py-1.5 caret-accent-500 shadow-[inset_0_1px_2px_0_rgb(0_0_0/0.05)] ring-1 ring-ss-secondary transition-shadow duration-200 has-[input,textarea,[contenteditable]]:cursor-text has-focus:ring-ss-primary',
		className
	)}
>
	<slot />
</label>

<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<label
	class={tw(
		'text-sf-primary flex [align-items:first_baseline] gap-2 px-4 py-3 font-medium',
		'[&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-end [&>input]:outline-hidden [&>input]:placeholder:opacity-50'
	)}
>
	{@render children?.()}
</label>

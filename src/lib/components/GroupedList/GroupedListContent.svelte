<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { children, class: classNames }: Props = $props();
</script>

<div class={tw('px-4 py-3', classNames)}>
	{@render children?.()}
</div>

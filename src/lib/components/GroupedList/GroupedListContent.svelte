<script lang="ts">
	import { tw } from '$lib/tw';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { children, class: classNames, ...rest }: Props = $props();
</script>

<div class={tw('px-4 py-3 font-medium', classNames)} {...rest}>
	{@render children?.()}
</div>

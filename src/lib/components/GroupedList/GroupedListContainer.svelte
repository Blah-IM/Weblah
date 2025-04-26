<script lang="ts">
	import { tw } from '$lib/tw';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		children?: import('svelte').Snippet;
		class?: string;
	} & Omit<HTMLAttributes<HTMLDivElement>, 'class'>;

	let { children, class: className, ...rest }: Props = $props();
</script>

<div class={tw('mx-auto max-w-3xl', className)} {...rest}>
	{@render children?.()}
</div>

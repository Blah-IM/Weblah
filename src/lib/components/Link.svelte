<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		href: string;
		variant?: 'primary' | 'secondary';
		children?: import('svelte').Snippet;
	}

	let { href, variant = 'primary', children }: Props = $props();
</script>

<a
	{href}
	class={tw(
		'underline',
		variant === 'primary'
			? 'text-accent-600 dark:text-accent-500'
			: 'text-accent-400 dark:text-accent-500'
	)}>{@render children?.()}</a
>

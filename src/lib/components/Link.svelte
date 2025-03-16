<script lang="ts">
	import { tw } from '$lib/tw';

	export let href: string;
	export let variant: 'primary' | 'secondary' = 'primary';
</script>

<a
	{href}
	class={tw(
		'underline',
		variant === 'primary'
			? 'text-accent-600 dark:text-accent-500'
			: 'text-accent-400 dark:text-accent-500'
	)}><slot /></a
>

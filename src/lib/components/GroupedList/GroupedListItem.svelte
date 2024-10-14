<script lang="ts">
	import { tw } from '$lib/tw';
	import { Icon, type IconSource } from 'svelte-hero-icons';

	export let href: string | undefined = undefined;
	export let icon: IconSource | undefined = undefined;
	export let selected: boolean = false;
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class={tw(
		'flex items-center gap-2 px-4 py-3 font-medium text-sf-primary first:rounded-t-lg last:rounded-b-lg',
		selected && 'bg-accent-500 text-white shadow-inner dark:bg-accent-900 dark:text-sf-primary'
	)}
>
	{#if icon}
		<Icon
			src={icon}
			class={tw('size-5 text-sf-secondary', selected && 'text-white dark:text-sf-primary')}
			mini
		/>
	{/if}
	<slot />
</svelte:element>

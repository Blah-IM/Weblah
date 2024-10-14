<script lang="ts">
	import { Icon, type IconSource } from 'svelte-hero-icons';

	export let href: string | undefined = undefined;
	export let icon: IconSource | undefined = undefined;
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class="flex items-center gap-2 px-4 py-3 font-medium text-sf-primary"
>
	{#if icon}
		<Icon src={icon} class="size-5 text-sf-secondary" mini />
	{/if}
	<slot />
</svelte:element>

<script lang="ts">
	import { tw } from '$lib/tw';
	import { Icon, type IconSource } from 'svelte-hero-icons';
	import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		icon?: IconSource | undefined;
		selected?: boolean;
		children?: import('svelte').Snippet;
		class?: string;
	} & (
		| ({ href: string } & Omit<HTMLAnchorAttributes, 'class' | 'href'>)
		| ({ onclick: Required<HTMLButtonAttributes['onclick']> } & Omit<HTMLButtonAttributes, 'class'>)
		| Omit<HTMLAttributes<HTMLDivElement>, 'onclick'>
	);

	let {
		icon = undefined,
		selected = false,
		children,
		class: externalClass,
		...rest
	}: Props = $props();

	const className = $derived(
		tw(
			'text-sf-primary flex w-full cursor-default items-center gap-2 px-4 py-3 font-medium first:rounded-t-lg last:rounded-b-lg',
			selected && 'bg-accent-500 dark:bg-accent-900 dark:text-sf-primary text-white shadow-inner',
			externalClass
		)
	);
</script>

{#snippet content()}
	{#if icon}
		<Icon
			src={icon}
			class={tw('text-sf-secondary size-5 shrink-0', selected && 'dark:text-sf-primary text-white')}
			mini
		/>
	{/if}
	<div class="min-w-0 truncate text-start">
		{@render children?.()}
	</div>
{/snippet}

{#if 'href' in rest}
	<a class={className} {...rest}>{@render content()}</a>
{:else if 'onclick' in rest}
	<button class={className} {...rest}>{@render content()}</button>
{:else}
	<div class={className} {...rest}>{@render content()}</div>
{/if}

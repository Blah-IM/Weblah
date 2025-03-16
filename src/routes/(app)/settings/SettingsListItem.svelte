<script lang="ts">
	import { page } from '$app/stores';
	import { GroupedListItem } from '$lib/components/GroupedList';
	import { type IconSource } from 'svelte-hero-icons';

	interface Props {
		icon?: IconSource | undefined;
		route?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let { icon = undefined, route = undefined, children }: Props = $props();

	let selected = $derived(route
		? $page.route.id?.startsWith(`/(app)/settings${route}`)
		: $page.route.id === '/(app)/settings');
	let href = $derived(`/settings${route}`);
</script>

<GroupedListItem {icon} {selected} {href}>{@render children?.()}</GroupedListItem>

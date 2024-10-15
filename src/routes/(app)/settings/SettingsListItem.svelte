<script lang="ts">
	import { page } from '$app/stores';
	import { GroupedListItem } from '$lib/components/GroupedList';
	import { type IconSource } from 'svelte-hero-icons';

	export let icon: IconSource | undefined = undefined;
	export let route: string | undefined = undefined;

	$: selected = route
		? $page.route.id?.startsWith(`/(app)/settings${route}`)
		: $page.route.id === '/(app)/settings';
	$: href = `/settings${route}`;
</script>

<GroupedListItem {icon} {selected} {href}><slot /></GroupedListItem>

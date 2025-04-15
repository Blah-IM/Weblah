<script lang="ts">
	import { GroupedListItem } from '$lib/components/GroupedList';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { idURLToUsername, validateIDURL } from '$lib/idURL';
	import type { BlahIdentity } from '@blah-im/core/identity';
	import { ExclamationCircle, ExclamationTriangle, Icon } from 'svelte-hero-icons';

	interface Props {
		url: string;
		identity?: BlahIdentity | null;
	}
	let { url, identity }: Props = $props();

	async function validate() {
		if (!identity) return null;

		return await validateIDURL(url, identity);
	}
</script>

<GroupedListItem>
	<span class="before:opacity-80 before:content-['@']">{idURLToUsername(url)}</span>

	{#await validate()}
		<LoadingIndicator />
	{:then result}
		{#if result && !result.valid}
			<Icon solid src={ExclamationCircle} class="size-5 text-red-500" />
		{/if}
	{/await}
</GroupedListItem>

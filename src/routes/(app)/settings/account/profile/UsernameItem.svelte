<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { GroupedListItem } from '$lib/components/GroupedList';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { idURLToUsername, validateIDURL } from '$lib/idURL';
	import type { BlahIdentity } from '@blah-im/core/identity';
	import { AtSymbol, ExclamationCircle, ExclamationTriangle, Icon } from 'svelte-hero-icons';

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
	<div class="flex items-center gap-0.5">
		<Icon micro src={AtSymbol} class="size-3.5 opacity-90" />
		<span>{idURLToUsername(url)}</span>
	</div>

	{#snippet badge()}
		{#await validate()}
			<LoadingIndicator />
		{:then result}
			{#if result && !result.valid}
				<Icon mini src={ExclamationCircle} class="size-5 fill-red-500 dark:fill-red-400" />
				<Button>Fix</Button>
			{/if}
		{/await}
	{/snippet}
</GroupedListItem>

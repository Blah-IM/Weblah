<script lang="ts">
	import { GroupedListItem } from '$lib/components/GroupedList';
	import { idURLToUsername, validateIDURL, type IDURLValidity } from '$lib/idURL';
	import type { BlahIdentity } from '@blah-im/core/identity';
	import { AtSymbol, ExclamationCircle, Icon } from 'svelte-hero-icons';
	import UsernameSetupSelfhostDialog from './UsernameSetupSelfhostDialog.svelte';

	interface Props {
		url: string;
		identity?: BlahIdentity | null;
	}
	let { url, identity }: Props = $props();

	let validationResult = $state<IDURLValidity | null>(null);
	let showFixDialog = $state(false);

	async function validate() {
		if (!identity) return null;

		validationResult = await validateIDURL(url, identity);
	}

	$effect.pre(() => {
		if (identity && !showFixDialog) {
			validate();
		}
	});

	const isInvalid = $derived(validationResult && !validationResult.valid);
</script>

<GroupedListItem onclick={isInvalid ? () => (showFixDialog = true) : undefined}>
	<div class="flex items-center gap-0.5">
		<Icon micro src={AtSymbol} class="size-3.5 opacity-90" />
		<span>{idURLToUsername(url)}</span>
	</div>

	{#snippet badge()}
		{#if isInvalid}
			<Icon mini src={ExclamationCircle} class="size-5 fill-red-500 dark:fill-red-400" />
			{#if url && identity}
				<UsernameSetupSelfhostDialog bind:open={showFixDialog} {url} {identity} />
			{/if}
		{/if}
	{/snippet}
</GroupedListItem>

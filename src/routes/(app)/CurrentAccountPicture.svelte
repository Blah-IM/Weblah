<script lang="ts">
	import {
		currentAccountStore,
		openAccountStore,
		type AccountStore
	} from '$lib/accounts/accountStore';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { onMount } from 'svelte';

	interface Props {
		size?: number;
	}

	let { size = 32 }: Props = $props();

	let accountStore: AccountStore | undefined = $state();

	onMount(() => {
		openAccountStore().then((store) => {
			accountStore = store;
		});
	});
</script>

{#if accountStore && $accountStore}
	{@const currentAccount = $accountStore.find((account) => account.id_key === $currentAccountStore)}
	<ProfilePicture identity={currentAccount} {size} />
{:else}
	<ProfilePicture identity={undefined} {size} />
{/if}

<script lang="ts">
	import {
		currentAccountStore,
		openAccountStore,
		type AccountStore
	} from '$lib/accounts/accountStore';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { onMount } from 'svelte';

	export let size: number = 32;

	let accountStore: AccountStore;

	onMount(() => {
		openAccountStore().then((store) => {
			accountStore = store;
		});
	});
</script>

{#if accountStore}
	{@const currentAccount = $accountStore.find((account) => account.id_key === $currentAccountStore)}
	<ProfilePicture account={currentAccount} {size} />
{:else}
	<ProfilePicture account={undefined} {size} />
{/if}

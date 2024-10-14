<script lang="ts">
	import {
		currentAccountStore,
		openAccountStore,
		type Account,
		type AccountStore
	} from '$lib/accounts/accountStore';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';

	export let size: number = 32;

	let accountStore: AccountStore;

	async function getAccount(idKeyId: string | null): Promise<Account | undefined> {
		if (!accountStore) {
			accountStore = await openAccountStore();
		}
		if (!idKeyId) return;
		let currentAccount = $accountStore.find((account) => account.id_key === idKeyId);
		if (!currentAccount && $accountStore.length > 0) {
			currentAccount = $accountStore[0];
			$currentAccountStore = currentAccount.id_key;
		}
		return currentAccount;
	}
</script>

{#await getAccount($currentAccountStore) then currentAccount}
	<ProfilePicture account={currentAccount} {size} />
{/await}

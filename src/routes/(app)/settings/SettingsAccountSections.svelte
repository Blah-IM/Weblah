<script lang="ts">
	import { GroupedListItem, GroupedListSection } from '$lib/components/GroupedList';
	import { ArrowRightEndOnRectangle, Plus, UserPlus } from 'svelte-hero-icons';
	import SettingsListItem from './SettingsListItem.svelte';
	import {
		openAccountStore,
		currentAccountStore,
		type AccountStore,
		type Account
	} from '$lib/accounts/accountStore';
	import { onMount } from 'svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { flip } from 'svelte/animate';
	import { blur } from 'svelte/transition';

	let accountStore: AccountStore | undefined = $state();

	onMount(() => {
		openAccountStore().then((store) => {
			accountStore = store;
		});
	});

	function switchToAccount(account: Account) {
		$currentAccountStore = account.id_key;
	}
</script>

{#if accountStore && $accountStore}
	{@const currentAccount = $accountStore.find((acc) => acc.id_key === $currentAccountStore)}
	{@const remainingAccounts = $accountStore
		.filter((acc) => acc.id_key !== $currentAccountStore)
		.toSorted((a, b) => a.profile.signee.payload.name.localeCompare(b.profile.signee.payload.name))}
	{#if currentAccount}
		{#key currentAccount.id_key}
			<div class="mt-6 p-4 text-center" in:blur>
				<div class="inline-block">
					<ProfilePicture account={currentAccount} size={68} />
				</div>
				<p>
					<span class="text-sf-primary text-xl font-semibold">
						{currentAccount.profile.signee.payload.name}
					</span>
				</p>
				<p>
					<code class="text-sf-secondary text-sm">
						{currentAccount.id_key.slice(0, 4) + '..' + currentAccount.id_key.slice(-4)}
					</code>
				</p>
			</div>
		{/key}
	{/if}

	{#if remainingAccounts.length > 0}
		<GroupedListSection>
			{#each remainingAccounts as account (account.id_key)}
				<div animate:flip={{ duration: 250 }} transition:blur>
					<GroupedListItem onclick={() => switchToAccount(account)}>
						<div class="-mx-0.5"><ProfilePicture {account} size={24} /></div>
						{account.profile.signee.payload.name}
					</GroupedListItem>
				</div>
			{/each}
		</GroupedListSection>
	{/if}
{/if}

<GroupedListSection>
	{#if ($accountStore?.length ?? 0) > 0}
		<SettingsListItem icon={Plus} route="/account/add">Add Account</SettingsListItem>
	{:else}
		<SettingsListItem icon={ArrowRightEndOnRectangle} route="/account/add">
			Sign in
		</SettingsListItem>
		<SettingsListItem icon={UserPlus} route="/account/new">Create Account</SettingsListItem>
	{/if}
</GroupedListSection>

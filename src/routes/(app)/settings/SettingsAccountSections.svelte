<script lang="ts">
	import { GroupedListItem, GroupedListSection } from '$lib/components/GroupedList';
	import { ArrowRightEndOnRectangle, UserPlus } from 'svelte-hero-icons';
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
	import { blur, scale } from 'svelte/transition';

	let accountStore: AccountStore;

	onMount(() => {
		openAccountStore().then((store) => {
			accountStore = store;
		});
	});

	function switchToAccount(account: Account) {
		$currentAccountStore = account.id_key;
	}
</script>

{#if accountStore}
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
					<span class="text-xl font-semibold text-sf-primary">
						{currentAccount.profile.signee.payload.name}
					</span>
				</p>
				<p>
					<code class="text-sm text-sf-secondary">
						{currentAccount.profile.signee.id_key.slice(0, 6) +
							'...' +
							currentAccount.profile.signee.id_key.slice(-6)}
					</code>
				</p>
			</div>
		{/key}
	{/if}

	{#if remainingAccounts.length > 0}
		<GroupedListSection>
			{#each remainingAccounts as account (account.id_key)}
				<div animate:flip={{ duration: 250 }} transition:blur>
					<GroupedListItem on:click={() => switchToAccount(account)}>
						<div class="-mx-0.5"><ProfilePicture {account} size={24} /></div>
						{account.profile.signee.payload.name}
					</GroupedListItem>
				</div>
			{/each}
		</GroupedListSection>
	{/if}
{/if}

<GroupedListSection>
	<SettingsListItem icon={ArrowRightEndOnRectangle} route="/account/add">Sign in</SettingsListItem>
	<SettingsListItem icon={UserPlus} route="/account/new">Create Account</SettingsListItem>
</GroupedListSection>

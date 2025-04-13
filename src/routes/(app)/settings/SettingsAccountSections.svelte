<script lang="ts">
	import { GroupedListItem, GroupedListSection } from '$lib/components/GroupedList';
	import { ArrowRightEndOnRectangle, Plus, UserPlus } from 'svelte-hero-icons';
	import SettingsListItem from './SettingsListItem.svelte';
	import manager, { type Account } from '$lib/accounts/manager.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { flip } from 'svelte/animate';
	import { blur } from 'svelte/transition';
	import GroupedListContent from '$lib/components/GroupedList/GroupedListContent.svelte';

	const currentAccount = $derived(manager.currentAccount);
	const remainingAccounts = $derived(
		manager.accounts
			.filter((acc) => acc.id_key !== manager.currentAccountId)
			.toSorted((a, b) =>
				a.profile.signee.payload.name.localeCompare(b.profile.signee.payload.name)
			)
	);

	function switchToAccount(account: Account) {
		manager.currentAccountId = account.id_key;
	}
</script>

{#if currentAccount}
	{#key currentAccount.id_key}
		<div class="mt-6 p-4 text-center" in:blur>
			<div class="inline-block">
				<ProfilePicture identity={currentAccount} size={68} />
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
			<GroupedListContent
				class="flex gap-2"
				role="button"
				tabindex={0}
				onclick={() => switchToAccount(account)}
			>
				<div class="-mx-0.5"><ProfilePicture identity={account} size={24} /></div>
				{account.profile.signee.payload.name}
			</GroupedListContent>
		{/each}
		<SettingsListItem icon={Plus} route="/account/add">Add Account</SettingsListItem>
	</GroupedListSection>
{:else}
	<GroupedListSection>
		<SettingsListItem icon={ArrowRightEndOnRectangle} route="/account/add">
			Sign in
		</SettingsListItem>
		<SettingsListItem icon={UserPlus} route="/account/new">Create Account</SettingsListItem>
	</GroupedListSection>
{/if}

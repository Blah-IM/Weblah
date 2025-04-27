<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { accountManager } from '$lib/accounts';
	import {
		GroupedListContainer,
		GroupedListSection,
		GroupedListInputItem
	} from '$lib/components/GroupedList';
	import type { BlahIdentity, BlahProfile } from '@blah-im/core/identity';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import Button from '$lib/components/Button.svelte';
	import RichTextInput from '$lib/components/RichTextInput.svelte';
	import { messageSchema } from '$lib/components/RichTextInput/schema';
	import { blahRichTextToProseMirrorDoc } from '$lib/richText';
	import type { Node } from 'prosemirror-model';
	import UsernameItem from './UsernameItem.svelte';

	const currentAccount = $derived(accountManager.currentAccount);
	let identity: BlahIdentity | null = $state(null);
	let profile: BlahProfile | null = $state(null);
	let initialBio: Node | null = $state(null);

	let isBusy: boolean = $state(false);

	$effect(() => {
		if (currentAccount) {
			const snapshot = $state.snapshot(currentAccount.profile.signee.payload);
			profile = snapshot;
			initialBio = blahRichTextToProseMirrorDoc([snapshot.bio ?? ''], messageSchema);
			accountManager.identityForAccount(currentAccount).then((x) => {
				identity = x;
			});
		}
	});

	async function saveProfile() {
		if (!currentAccount || !profile) return;

		isBusy = true;
		const identity = await accountManager.identityForAccount(currentAccount);
		await identity.updateProfile(profile);
		await accountManager.saveIdentity(identity);
		isBusy = false;
	}
</script>

<PageHeader>
	<h3 class="flex-1">My Profile</h3>
	<Button variant="primary" onclick={saveProfile} disabled={isBusy}>Save</Button>
</PageHeader>

{#if profile}
	<GroupedListContainer>
		<div class="mt-6 flex flex-col items-center gap-3 p-4">
			<ProfilePicture identity={currentAccount} size={80} />
			<Button>Change</Button>
		</div>

		<GroupedListSection>
			<GroupedListInputItem>
				Name
				<input type="text" bind:value={profile.name} placeholder="Name" />
			</GroupedListInputItem>
		</GroupedListSection>

		<GroupedListSection header="Bio">
			<RichTextInput
				class="text-ss-primary px-4 py-3 shadow-none ring-0"
				schema={messageSchema}
				onDocChange={(doc) => profile && (profile.bio = doc.textContent)}
				placeholder="a 25 yo. artist from Paris."
				initialDoc={initialBio}
			/>
		</GroupedListSection>

		<GroupedListSection header="Usernames">
			{#each profile.id_urls as url (url)}
				<UsernameItem {url} {identity} />
			{/each}
		</GroupedListSection>
	</GroupedListContainer>
{/if}

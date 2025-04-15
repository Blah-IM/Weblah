<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import accountsManager from '$lib/accounts/manager.svelte';
	import {
		GroupedListContainer,
		GroupedListSection,
		GroupedListInputItem,
		GroupedListContent,
		GroupedListItem
	} from '$lib/components/GroupedList';
	import type { BlahProfile } from '@blah-im/core/identity';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import Button from '$lib/components/Button.svelte';
	import RichTextInput from '$lib/components/RichTextInput.svelte';
	import { messageSchema } from '$lib/components/RichTextInput/schema';
	import { blahRichTextToProseMirrorDoc } from '$lib/richText';
	import type { Node } from 'prosemirror-model';

	const currentAccount = $derived(accountsManager.currentAccount);
	let profile: BlahProfile | null = $state(null);
	let initialBio: Node | null = $state(null);

	let isBusy: boolean = $state(false);

	$effect(() => {
		if (currentAccount) {
			const snapshot = $state.snapshot(currentAccount.profile.signee.payload);
			profile = snapshot;
			initialBio = blahRichTextToProseMirrorDoc([snapshot.bio ?? ''], messageSchema);
		}
	});

	async function saveProfile() {
		if (!currentAccount || !profile) return;

		isBusy = true;
		const identity = await accountsManager.identityForAccount(currentAccount);
		await identity.updateProfile(profile);
		await accountsManager.saveIdentity(identity);
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
				class="text-ss-primary p-4 shadow-none ring-0"
				schema={messageSchema}
				onDocChange={(doc) => profile && (profile.bio = doc.textContent)}
				placeholder="a 25 yo. artist from Paris."
				initialDoc={initialBio}
			/>
		</GroupedListSection>
	</GroupedListContainer>
{/if}

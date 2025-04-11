<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { currentAccountStore, openAccountStore } from '$lib/accounts/accountStore';
	import Button from '$lib/components/Button.svelte';
	import {
		GroupedListContainer,
		GroupedListSection,
		GroupedListItem,
		GroupedListInputItem
	} from '$lib/components/GroupedList';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import RichTextInput from '$lib/components/RichTextInput.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { BlahProfile } from '@blah-im/core/identity';
	import type { Node } from 'prosemirror-model';
	import { messageSchema } from '$lib/components/RichTextInput/schema';
	import GroupedListContent from '$lib/components/GroupedList/GroupedListContent.svelte';

	let name: string = $state('');
	let bioDoc: Node | null = $state(null);
	let password: string = $state('');
	let repeatPassword: string = $state('');
	let identityServer: string = $state('other.blue');

	let isBusy: boolean = $state(false);

	let passwordMatch = $derived(password === repeatPassword);
	let canCreate = $derived(name.length > 0 && password.length > 0 && passwordMatch);
	let customize = $derived(page.url.hash === '#customize');

	async function createAccount() {
		const profile: BlahProfile = {
			typ: 'profile',
			name,
			bio: bioDoc?.textContent,
			preferred_chat_server_urls: [],
			id_urls: []
		};
		isBusy = true;

		try {
			const accountStore = await openAccountStore();
			const idKeyId = await accountStore.createAccount(profile, password);
			$currentAccountStore = idKeyId;
		} catch (error) {
			console.error(error);
		}
		isBusy = false;
		goto('/settings');
	}
</script>

<PageHeader>
	<h3 class="flex-1">Create Account</h3>
	{#if isBusy}
		<LoadingIndicator class="size-4" />
	{:else}
		<Button variant="primary" disabled={!canCreate} onclick={createAccount}>Create</Button>
	{/if}
</PageHeader>

<GroupedListContainer>
	<GroupedListSection>
		<GroupedListContent class="flex items-center">
			<ProfilePicture size={64} account={undefined} />
			<input
				type="text"
				bind:value={name}
				placeholder="Your Name"
				disabled={isBusy}
				class="caret-accent-500 ms-3 flex-1 bg-transparent text-lg leading-loose outline-hidden placeholder:opacity-50"
			/>
		</GroupedListContent>
	</GroupedListSection>

	<GroupedListSection
		header="Bio"
		footer="Introduce yourself. This will be public for everyone to see."
	>
		<RichTextInput
			schema={messageSchema}
			onDocChange={(newDoc) => (bioDoc = newDoc)}
			class="p-4 shadow-none ring-0"
			placeholder="a 25 yo. artist from Paris."
		/>
	</GroupedListSection>

	<GroupedListSection header="Security">
		<GroupedListInputItem>
			Password
			<input type="password" bind:value={password} placeholder="Password" disabled={isBusy} />
		</GroupedListInputItem>
		<GroupedListInputItem>
			Repeat Password
			<input
				type="password"
				bind:value={repeatPassword}
				placeholder="Repeat Password"
				disabled={isBusy}
			/>
		</GroupedListInputItem>
		{#snippet footer()}
			<div class="space-y-1">
				<p>
					Sensitive actions like signing in on new devices require your password. Make sure it's
					unique and secure. You'll lose access to your account if you forget it.
				</p>
				{#if !passwordMatch && repeatPassword}
					<p><strong>Passwords do not match.</strong></p>
				{/if}
			</div>
		{/snippet}
	</GroupedListSection>
	{#if customize}
		<GroupedListSection header="Identity Service">
			<GroupedListInputItem>
				Initial Service
				<input type="text" bind:value={identityServer} />
			</GroupedListInputItem>
			{#snippet footer()}
				<div class="space-y-1">
					<p>
						Your profile is stored and served to other users on the identity service.
						<Link href="/" variant="secondary">Learn more about identity services...</Link>
					</p>
					<p>You can add, replace or remove identity services later in account settings.</p>
				</div>
			{/snippet}
		</GroupedListSection>
	{/if}
	<div class="text-sf-tertiary px-8 text-sm">
		<p>
			By creating an account, you agree to Terms of Service and Privacy Policy of
			<em>{identityServer}</em>, which stores and serve your public profile to other users.
			{#if customize}
				<Link href="#">Use default</Link>
			{:else}
				<Link href="#customize">Customize...</Link>
			{/if}
		</p>
	</div>
</GroupedListContainer>

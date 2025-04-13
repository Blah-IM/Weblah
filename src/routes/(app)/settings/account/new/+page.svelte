<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import accountsManager from '$lib/accounts/manager.svelte';
	import Button from '$lib/components/Button.svelte';
	import {
		GroupedListContainer,
		GroupedListSection,
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
	let selfhostDomain: string = $state('');

	let isBusy: boolean = $state(false);

	const passwordMatch = $derived(password === repeatPassword);
	const selfhostIdentity = $derived(page.url.hash === '#identity-selfhost');
	const canCreate = $derived(
		name.length > 0 &&
			password.length > 0 &&
			passwordMatch &&
			(selfhostIdentity ? selfhostDomain.length > 0 : false)
	);

	async function createAccount() {
		const profile: BlahProfile = {
			typ: 'profile',
			name,
			bio: bioDoc?.textContent,
			preferred_chat_server_urls: [],
			id_urls: selfhostIdentity ? ['https://' + selfhostDomain] : []
		};
		isBusy = true;

		try {
			const idKeyId = await accountsManager.createAccount(profile, password);
			accountsManager.currentAccountId = idKeyId;
			goto('/settings');
		} catch (error) {
			console.error(error);
		}
		isBusy = false;
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
			<ProfilePicture size={64} identity={undefined} />
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
	{#if selfhostIdentity}
		<GroupedListSection header="Profile Hosting">
			<GroupedListInputItem>
				Domain Name
				<input type="text" bind:value={selfhostDomain} placeholder="example.com" />
			</GroupedListInputItem>
			{#snippet footer()}
				<div class="space-y-1">
					<p>
						After creating account, you need to serve your profile file to a specific location under
						this domain.
						<Link href="/" variant="secondary">Learn more about hosting your own profile...</Link>
					</p>
					<p>
						<Link href="#" variant="secondary">Use identity service</Link> if you you want a simple way
						to start. You can always switch to self-hosting later.
					</p>
				</div>
			{/snippet}
		</GroupedListSection>
	{:else}
		<GroupedListSection header="Identity Service">
			<GroupedListInputItem>
				Initial Service
				<input type="text" bind:value={identityServer} />
			</GroupedListInputItem>
			{#snippet footer()}
				<div class="space-y-1">
					<p>
						By creating an account on <em>{identityServer}</em>, which stores and serve this public
						profile to other users, you agree to Terms of Service and Privacy Policy of
						<em>{identityServer}</em>.
						<Link href="/" variant="secondary">Learn more about identity services...</Link>
					</p>
					<p>You can add, replace or remove identity services later in account settings.</p>
					<p>
						If you own or can afford a domain name, you can
						<Link href="#identity-selfhost" variant="secondary">host your own profile</Link>
						instead of using a service.
					</p>
				</div>
			{/snippet}
		</GroupedListSection>
	{/if}
</GroupedListContainer>

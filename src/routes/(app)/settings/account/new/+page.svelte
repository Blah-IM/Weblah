<script lang="ts">
	import { goto } from '$app/navigation';
	import { openAccountStore } from '$lib/accounts/accountStore';
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
	import type { BlahProfile } from '@blah-im/core/identity';
	import { onMount } from 'svelte';
	import type { Delta, Editor } from 'typewriter-editor';

	let name: string = '';
	let editor: Editor | undefined;
	let delta: Delta;
	let plainText: string = '';
	let password: string = '';
	let repeatPassword: string = '';

	let isBusy: boolean = false;

	let bioPlaceholder = 'Introduce yourself.';

	const bioPlaceholders = [
		'a 23 yo. designer from Tokyo.',
		'a 19 yo. student from New York.',
		'a 30 yo. developer from Berlin.',
		'a 25 yo. artist from Paris.',
		'a 28 yo. writer from London.'
	];

	$: passwordMatch = password === repeatPassword;
	$: canCreate = name.length > 0 && password.length > 0 && passwordMatch;

	onMount(() => {
		const bioPlaceholderRotateRef = setInterval(() => {
			bioPlaceholder = bioPlaceholders[Math.floor(Math.random() * bioPlaceholders.length)];
		}, 5000);
		return () => clearInterval(bioPlaceholderRotateRef);
	});

	async function createAccount() {
		const profile: BlahProfile = {
			typ: 'profile',
			name,
			bio: plainText,
			preferred_chat_server_urls: [],
			id_urls: []
		};
		isBusy = true;

		try {
			const accountStore = await openAccountStore();
			await accountStore.createAccount(profile, password);
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
		<Button variant="primary" disabled={!canCreate} on:click={createAccount}>Create</Button>
	{/if}
</PageHeader>

<GroupedListContainer>
	<GroupedListSection>
		<GroupedListItem>
			<ProfilePicture size={64} account={undefined} />
			<input
				type="text"
				bind:value={name}
				placeholder="Your Name"
				disabled={isBusy}
				class="ms-3 flex-1 bg-transparent text-lg leading-loose caret-accent-500 outline-none placeholder:opacity-50"
			/>
		</GroupedListItem>
	</GroupedListSection>

	<GroupedListSection>
		<h4 slot="header">Bio</h4>
		<RichTextInput
			class="p-4 shadow-none ring-0"
			bind:editor
			bind:delta
			bind:plainText
			placeholder={bioPlaceholder}
		/>
		<p slot="footer">Introduce yourself. This will be public for everyone to see.</p>
	</GroupedListSection>

	<GroupedListSection>
		<h4 slot="header">Security</h4>
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
		<div slot="footer" class="space-y-1">
			<p>
				Sensitive actions like signing in on new devices require your password. Make sure it's
				unique and secure. You'll lose access to your account if you forget it.
			</p>
			{#if !passwordMatch && repeatPassword}
				<p><strong>Passwords do not match.</strong></p>
			{/if}
		</div>
	</GroupedListSection>
</GroupedListContainer>

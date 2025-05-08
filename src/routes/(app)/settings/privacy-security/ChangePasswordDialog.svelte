<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import GroupedListContainer from '$lib/components/GroupedList/GroupedListContainer.svelte';
	import GroupedListInputItem from '$lib/components/GroupedList/GroupedListInputItem.svelte';
	import GroupedListSection from '$lib/components/GroupedList/GroupedListSection.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { accountManager } from '$lib/accounts';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	let step: 0 | 1 | 2 = $state(0);
	let error: 'old-incorrect' | 'new-empty' | 'new-mismatch' | null = $state(null);
	let oldPassword = $state('');
	let newPassword = $state('');
	let repeatPassword = $state('');

	function reset() {
		oldPassword = '';
		newPassword = '';
		repeatPassword = '';
		step = 0;
		error = null;
	}

	$effect.pre(() => {
		if (!open) {
			// Reset all fields and state when dialog is closed
			reset();
		}
	});

	async function nextStep(e: Event) {
		e.preventDefault();
		error = null;

		switch (step) {
			case 0:
				if (oldPassword.length === 0) {
					error = 'old-incorrect';
					return;
				}

				try {
					if (!accountManager.currentAccountId) {
						throw new Error('No current account selected');
					}

					await accountManager.identityForAccount(accountManager.currentAccountId, oldPassword);

					step = 1;
				} catch (err) {
					console.error('Password verification failed:', err);
					error = 'old-incorrect';
				}
				break;
			case 1:
				if (newPassword.length === 0) {
					error = 'new-empty';
					return;
				}

				if (newPassword !== repeatPassword) {
					error = 'new-mismatch';
					return;
				}

				try {
					if (!accountManager.currentAccountId) {
						throw new Error('No current account selected');
					}

					await accountManager.changePassword(
						accountManager.currentAccountId,
						oldPassword,
						newPassword
					);

					step = 2;
				} catch (err) {
					console.error('Password change failed:', err);
					error = 'old-incorrect';
				}
				break;
			case 2:
				open = false;
		}
	}

	const nextButtonText = $derived.by(() => {
		switch (step) {
			case 0:
				return 'Next';
			case 1:
				return 'Change';
			case 2:
				return 'Done';
		}
	});
</script>

{#snippet errorHint()}
	{#if error}
		<p class="mt-1 text-sm text-red-500">
			{#if error === 'old-incorrect'}
				Incorrect password
			{:else if error === 'new-empty'}
				Password cannot be empty
			{:else if error === 'new-mismatch'}
				Passwords do not match
			{/if}
		</p>
	{/if}
{/snippet}

<Dialog bind:open class="h-1/2">
	<form onsubmit={nextStep}>
		<PageHeader>
			<h3 class="grow">Change Password</h3>
			<Button variant="primary" type="submit">{nextButtonText}</Button>
		</PageHeader>

		<GroupedListContainer>
			{#if step === 0}
				<div class="my-10 space-y-2 px-8 text-center">
					<p>
						On this device, anyone who knows this password have <em>full access</em> to your account.
					</p>
					<p>To change your password, enter your current password first.</p>
				</div>

				<GroupedListSection>
					<GroupedListInputItem>
						Current Password
						<input
							type="password"
							bind:value={oldPassword}
							placeholder="Current Password"
							class:border-red-500={error === 'old-incorrect'}
						/>
					</GroupedListInputItem>
					{#snippet footer()}
						{@render errorHint()}
						<p>
							Note: password is per device. If you granted other devices <em>full access</em>, you
							need to change password on these devices too.
						</p>
					{/snippet}
				</GroupedListSection>
			{:else if step === 1}
				<div class="my-10 space-y-2 px-8 text-center">
					<p>Now enter your new password</p>
					<p>
						Make sure it's unique and secure, and <em>remember it</em>. You'll lose access to your
						account if you forget it.
					</p>
				</div>

				<GroupedListSection>
					<GroupedListInputItem>
						New Password
						<input
							type="password"
							bind:value={newPassword}
							placeholder="New Password"
							class:border-red-500={error === 'new-empty'}
						/>
					</GroupedListInputItem>
					<GroupedListInputItem>
						Repeat
						<input
							type="password"
							bind:value={repeatPassword}
							placeholder="Repeat Password"
							class:border-red-500={error === 'new-mismatch'}
						/>
					</GroupedListInputItem>

					{#snippet footer()}
						{@render errorHint()}
					{/snippet}
				</GroupedListSection>
			{:else if step === 2}
				<div class="my-10 space-y-2 px-8 text-center">
					<p>Password changed successfully!</p>
					<p>
						Remember to change it on all other devices to which you granted <em>full access</em>.
					</p>
				</div>
			{/if}
		</GroupedListContainer>
	</form>
</Dialog>

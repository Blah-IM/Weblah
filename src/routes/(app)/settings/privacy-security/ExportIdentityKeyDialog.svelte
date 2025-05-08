<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { accountManager } from '$lib/accounts';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	async function exportIdentityBackup() {
		try {
			if (!accountManager.currentAccountId || !accountManager.currentAccount) {
				throw new Error('No current account selected');
			}

			const encodedKeyPair = await accountManager.exportAccountIDKeyPair(
				accountManager.currentAccountId
			);

			// Create a JSON blob
			const jsonData = JSON.stringify(encodedKeyPair, null, 2);
			const blob = new Blob([jsonData], { type: 'application/json' });

			// Generate download link
			const url = URL.createObjectURL(blob);
			const downloadLink = document.createElement('a');
			downloadLink.href = url;

			// Set the filename with the account name
			const accountName =
				accountManager.currentAccount.profile?.signee.payload.name ||
				accountManager.currentAccountId.slice(-6);
			downloadLink.download = `Blah ID Backup - ${accountName}.json`;

			// Trigger download and clean up
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			URL.revokeObjectURL(url);

			open = false;
		} catch (err) {
			console.error('Failed to export identity backup:', err);
		}
	}
</script>

<Dialog bind:open class="h-1/3">
	<PageHeader>
		<h3 class="grow">Export Identity Backup</h3>
	</PageHeader>

	<div class="flex flex-col items-center space-y-6 overflow-y-auto p-6">
		<p class="text-center">
			This will generate a backup file containing your encrypted identity keys. You'll need your
			current password to use this backup later.
		</p>

		<Button variant="primary" onclick={exportIdentityBackup}>Save Backup File</Button>

		<p class="text-center text-sm text-gray-600">
			Keep this file in a secure location. Anyone with this file and your password will have
			<em>full access</em> to your account.
		</p>
	</div>
</Dialog>

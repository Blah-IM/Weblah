<script lang="ts">
	import { GroupedListContainer } from '$lib/components/GroupedList';
	import GroupedListItem from '$lib/components/GroupedList/GroupedListItem.svelte';
	import GroupedListSection from '$lib/components/GroupedList/GroupedListSection.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { DocumentDuplicate, Key } from 'svelte-hero-icons';
	import ChangePasswordDialog from './ChangePasswordDialog.svelte';
	import ExportIdentityKeyDialog from './ExportIdentityKeyDialog.svelte';

	let showChangePasswordDialog = $state(false);
	let showExportIdentityDialog = $state(false);
</script>

<PageHeader>
	<h3 class="flex-1">Privacy & Security</h3>
</PageHeader>

<GroupedListContainer>
	<GroupedListSection>
		<GroupedListItem icon={Key} onclick={() => (showChangePasswordDialog = true)}>
			Change Password
		</GroupedListItem>
	</GroupedListSection>

	<GroupedListSection>
		<GroupedListItem icon={DocumentDuplicate} onclick={() => (showExportIdentityDialog = true)}>Generate Identity Backup File</GroupedListItem>
		{#snippet footer()}
			<p>
				In case you don't have any other <em>full-access-enabled</em> devices, this file, combining
				with your <em>current password</em>, can be imported on Blah apps to regain
				<em>full access</em>.
			</p>
		{/snippet}
	</GroupedListSection>
</GroupedListContainer>

<ChangePasswordDialog bind:open={showChangePasswordDialog} />
<ExportIdentityKeyDialog bind:open={showExportIdentityDialog} />

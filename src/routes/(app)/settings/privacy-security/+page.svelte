<script lang="ts">
	import { GroupedListContainer } from '$lib/components/GroupedList';
	import GroupedListItem from '$lib/components/GroupedList/GroupedListItem.svelte';
	import GroupedListSection from '$lib/components/GroupedList/GroupedListSection.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { DocumentDuplicate, Key } from 'svelte-hero-icons';
	import ChangePasswordDialog from './ChangePasswordDialog.svelte';

	let showChangePasswordDialog = $state(false);
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
		<GroupedListItem icon={DocumentDuplicate}>Backup Account</GroupedListItem>
	</GroupedListSection>
</GroupedListContainer>

<ChangePasswordDialog bind:open={showChangePasswordDialog} />

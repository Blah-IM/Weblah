<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import GroupedListContainer from '$lib/components/GroupedList/GroupedListContainer.svelte';
	import GroupedListInputItem from '$lib/components/GroupedList/GroupedListInputItem.svelte';
	import GroupedListSection from '$lib/components/GroupedList/GroupedListSection.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	let oldPassword = $state('');
</script>

<Dialog bind:open class="h-1/2">
	<PageHeader>
		<h3 class="grow">Change Password</h3>
		<Button variant="primary">Next</Button>
	</PageHeader>

	<GroupedListContainer>
		<div class="my-10 space-y-2 px-8 text-center">
			<p>
				On this device, anyone who knows this password have <em>full access</em> to your account.
			</p>
			<p>To change your password, enter your current password first.</p>
		</div>

		<GroupedListSection>
			<GroupedListInputItem>
				Current Password
				<input type="password" bind:value={oldPassword} placeholder="Current Password" />
			</GroupedListInputItem>
			{#snippet footer()}
				<p>
					Note: password is per device. If you granted other devices <em>full access</em>, you need
					to change password on these devices too.
				</p>
			{/snippet}
		</GroupedListSection>
	</GroupedListContainer>
</Dialog>

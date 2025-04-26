<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { GroupedListContainer, GroupedListSection } from '$lib/components/GroupedList';
	import GroupedListContent from '$lib/components/GroupedList/GroupedListContent.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { idURLToUsername } from '$lib/idURL';
	import type { BlahIdentity } from '@blah-im/core/identity';

	interface Props {
		open: boolean;
		url: string;
		identity: BlahIdentity;
	}

	let { open = $bindable(), url, identity }: Props = $props();

	const username = $derived(idURLToUsername(url));
	const profileDescriptionString = $derived(
		JSON.stringify(identity.generateIdentityDescription(), null, 2)
	);
</script>

<Dialog bind:open class="flex h-2/3 flex-col">
	<PageHeader>
		<h3 class="flex-1">Setup Domain {username}</h3>
		<Button variant="primary" onclick={() => (open = false)}>Done</Button>
	</PageHeader>

	<GroupedListContainer class="w-full grow overflow-x-auto">
		<GroupedListSection>
			{#snippet header()}
				<div class="-me-4 flex min-w-0 items-end gap-2 text-base normal-case">
					<p class="text-sf-primary">
						For others to validate your domain as your username, put the content below at
						<code>/.well-known/blah/profile.json</code>
						under your domain.
					</p>
					<Button>Copy</Button>
				</div>
			{/snippet}
			<GroupedListContent class="p-0">
				<textarea
					readonly
					class="text-sf-primary block h-100 w-full resize-none overflow-x-auto px-4 py-3 font-mono"
					value={profileDescriptionString}
				></textarea>
			</GroupedListContent>
		</GroupedListSection>
	</GroupedListContainer>
</Dialog>

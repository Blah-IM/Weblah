<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { GroupedListSection, GroupedListItem } from '$lib/components/GroupedList';
	import { tw } from '$lib/tw';
	import {
		Bell,
		DevicePhoneMobile,
		InformationCircle,
		LockClosed,
		QuestionMarkCircle,
		User
	} from 'svelte-hero-icons';
	import { scale } from 'svelte/transition';
	import SettingsListItem from './SettingsListItem.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SettingsAccountSections from './SettingsAccountSections.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div
	class={tw('bg-sb-secondary flex flex-col shadow-md', className)}
	transition:scale={{ duration: 250, start: 0.95 }}
>
	<PageHeader>
		<Button href="/">Done</Button>
		<h2 class="flex-1 truncate text-center">Settings</h2>
		<Button href="/account/profile">Edit</Button>
	</PageHeader>
	<div class="flex-1 overflow-y-scroll">
		<SettingsAccountSections />

		<GroupedListSection>
			<SettingsListItem icon={User} route="/account/profile">My Profile</SettingsListItem>
			<GroupedListItem icon={DevicePhoneMobile}>Devices</GroupedListItem>
		</GroupedListSection>

		<GroupedListSection>
			<GroupedListItem icon={Bell}>Notifications</GroupedListItem>
			<SettingsListItem icon={LockClosed} route="/privacy-security">
				Privacy and Security
			</SettingsListItem>
		</GroupedListSection>

		<GroupedListSection>
			<GroupedListItem icon={InformationCircle}>About Blah & Weblah</GroupedListItem>
			<GroupedListItem icon={QuestionMarkCircle}>Ask a Question</GroupedListItem>
		</GroupedListSection>
	</div>
</div>

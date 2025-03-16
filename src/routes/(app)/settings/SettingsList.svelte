<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { GroupedListSection, GroupedListItem } from '$lib/components/GroupedList';
	import { tw } from '$lib/tw';
	import {
		Bell,
		Cog,
		DevicePhoneMobile,
		InformationCircle,
		LockClosed,
		QuestionMarkCircle
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
	class={tw('flex flex-col bg-sb-secondary shadow-md', className)}
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
			<SettingsListItem icon={Cog} route="">General</SettingsListItem>
			<GroupedListItem icon={Bell}>Notifications</GroupedListItem>
			<GroupedListItem icon={LockClosed}>Privacy and Security</GroupedListItem>
			<GroupedListItem icon={DevicePhoneMobile}>Devices</GroupedListItem>
		</GroupedListSection>

		<GroupedListSection>
			<GroupedListItem icon={InformationCircle}>About Blah & Weblah</GroupedListItem>
			<GroupedListItem icon={QuestionMarkCircle}>Ask a Question</GroupedListItem>
		</GroupedListSection>
	</div>
</div>

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
		QuestionMarkCircle,
		UserPlus
	} from 'svelte-hero-icons';

	let className = '';
	export { className as class };
</script>

<div class={tw('flex flex-col bg-sb-secondary shadow-md', className)}>
	<div class="flex items-center border-b border-ss-secondary bg-sb-primary p-2 shadow-sm">
		<Button href="/">Done</Button>
		<h2 class="flex-1 truncate text-center font-semibold text-sf-primary">Settings</h2>
	</div>
	<div class="flex-1 overflow-y-scroll">
		<GroupedListSection>
			<GroupedListItem icon={UserPlus}>Add Account</GroupedListItem>
		</GroupedListSection>
		<GroupedListSection>
			<GroupedListItem icon={Cog} selected>General</GroupedListItem>
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

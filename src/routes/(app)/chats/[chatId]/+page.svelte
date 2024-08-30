<script lang="ts">
	import { page } from '$app/stores';
	import BgPattern from '$lib/components/BgPattern.svelte';
	import ChatHeader from './ChatHeader.svelte';
	import ChatInput from './ChatInput.svelte';
</script>

<div class="flex h-full w-full flex-col justify-stretch">
	<ChatHeader
		chat={{ id: 'blah', name: 'Blah IM Interest Group', type: 'group' }}
		outsideUnreadCount={263723}
	/>
	<BgPattern class="flex-1" pattern="charlieBrown"></BgPattern>
	<ChatInput />
</div>

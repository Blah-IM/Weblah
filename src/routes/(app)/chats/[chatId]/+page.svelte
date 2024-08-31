<script lang="ts">
	import { page } from '$app/stores';
	import BgPattern from '$lib/components/BgPattern.svelte';
	import { createRandomMessage } from '$lib/mock/messages';
	import type { Message } from '$lib/types';
	import { onMount } from 'svelte';
	import ChatHeader from './ChatHeader.svelte';
	import ChatHistory from './ChatHistory.svelte';
	import ChatInput from './ChatInput.svelte';

	let messages: Message[] = [
		...Array.from({ length: 5 }).map(() => createRandomMessage({})),
		...Array.from({ length: 2 }).map(() =>
			createRandomMessage({ sender: { id: '_send', name: 'Shibo Lyu' } })
		)
	];

	// onMount(() => {
	// 	const interval = setInterval(
	// 		() => {
	// 			messages = [...messages, createRandomMessage({})];
	// 		},
	// 		3000 + Math.random() * 10000
	// 	);
	// 	return () => clearInterval(interval);
	// });
</script>

<div class="flex h-full w-full flex-col justify-stretch">
	<ChatHeader
		chat={{ id: 'blah', name: 'Blah IM Interest Group', type: 'group' }}
		outsideUnreadCount={263723}
	/>
	<BgPattern class="flex-1" pattern="charlieBrown">
		<ChatHistory {messages} mySenderId={'_send'} />
	</BgPattern>
	<ChatInput />
</div>

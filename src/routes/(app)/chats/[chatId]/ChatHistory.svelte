<script lang="ts">
	import { VList } from 'virtua/svelte';

	import type { Message } from '$lib/types';
	import ChatMessage from './ChatMessage.svelte';

	export let messages: Message[] = [];
	export let mySenderId: string;

	let ref: VList<Message>;

	$: ref?.scrollToIndex(messages.length - 1, { align: 'end', smooth: true });
</script>

<VList data={messages} let:item={message} class="size-full pt-2" bind:this={ref}>
	<ChatMessage {message} isMyself={mySenderId === message.sender.id} />
</VList>

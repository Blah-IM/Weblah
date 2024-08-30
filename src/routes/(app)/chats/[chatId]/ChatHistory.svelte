<script lang="ts">
	import { VList } from 'virtua/svelte';

	import type { Message } from '$lib/types';
	import ChatMessage from './ChatMessage.svelte';
	import { tick } from 'svelte';

	export let messages: Message[] = [];
	export let mySenderId: string;

	let ref: VList<Message> | undefined;

	async function scrollToIndex(index: number, smooth = true) {
		await tick();
		ref?.scrollToIndex(index, { align: 'end', smooth });
	}

	$: scrollToIndex(messages.length - 1);
</script>

<VList data={messages} let:item={message} class="size-full pt-2" bind:this={ref}>
	<ChatMessage {message} isMyself={mySenderId === message.sender.id} />
</VList>

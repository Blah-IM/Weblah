<script lang="ts">
	import { VList } from 'virtua/svelte';

	import type { Message } from '$lib/types';
	import ChatMessage from './ChatMessage.svelte';
	import { tick } from 'svelte';
	import type { MessageSection } from '$lib/chat';
	import { tw } from '$lib/tw';
	import { AvatarBeam } from 'svelte-boring-avatars';
	import ServiceMessage from '$lib/components/ServiceMessage.svelte';
	import { formatMessageDate, formatMessageSectionDate } from '$lib/formatters';

	export let sectionedMessages: MessageSection[] = [];
	export let mySenderId: string;

	let ref: VList<MessageSection> | undefined;

	async function scrollToIndex(index: number, smooth = true) {
		await tick();
		ref?.scrollToIndex(index, { align: 'end', smooth });
	}

	$: scrollToIndex(sectionedMessages.length - 1);
</script>

<VList data={sectionedMessages} let:item={messageSection} class="size-full pt-2" bind:this={ref}>
	{@const isMyself = mySenderId === messageSection.sender?.id}

	<div>
		{#if messageSection.date}
			<div class="pb-1.5 text-center">
				<ServiceMessage class="text-xs">
					{formatMessageSectionDate(messageSection.date)}
				</ServiceMessage>
			</div>
		{/if}
		<div class={tw('flex w-full items-end px-2', isMyself && 'flex-row-reverse')}>
			<div class="sticky bottom-1.5 mb-1.5 mt-1 w-8">
				<AvatarBeam size={32} name={messageSection.sender?.id} />
			</div>
			<div class="flex-1">
				{#each messageSection.messages as message, idx}
					<ChatMessage
						{message}
						{isMyself}
						showBubbleTail={messageSection.messages.length - 1 === idx}
					/>
				{/each}
			</div>
		</div>
	</div>
</VList>

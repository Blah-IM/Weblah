<script lang="ts">
	import { run } from 'svelte/legacy';

	import { VList } from 'virtua/svelte';

	import ChatMessage from './ChatMessage.svelte';
	import { tick } from 'svelte';
	import type { MessageSection } from '$lib/chat';
	import { tw } from '$lib/tw';
	import { AvatarBeam } from 'svelte-boring-avatars';
	import ServiceMessage from '$lib/components/ServiceMessage.svelte';
	import { formatMessageSectionDate } from '$lib/formatters';

	interface Props {
		sectionedMessages?: MessageSection[];
		mySenderId: string;
	}

	let { sectionedMessages = [], mySenderId }: Props = $props();

	let ref: VList<MessageSection> | undefined = $state();

	async function scrollToIndex(index: number, smooth = true) {
		await tick();
		ref?.scrollToIndex(index, { align: 'end', smooth });
	}

	run(() => {
		scrollToIndex(sectionedMessages.length - 1);
	});
</script>

<VList data={sectionedMessages}  class="size-full pt-2" bind:this={ref}>
	{#snippet children({ item: messageSection })}
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
					{#if messageSection.sender && !isMyself}
						<div class="px-3 py-0.5 text-xs text-sf-tertiary">{messageSection.sender.name}</div>
					{/if}
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
	{/snippet}
</VList>

<script lang="ts">
	import RichTextRenderer from '$lib/components/RichTextRenderer.svelte';
	import { tw } from '$lib/tw';
	import type { Message } from '$lib/types';

	interface Props {
		message: Message;
		showBubbleTail?: boolean;
		isMyself: boolean;
	}

	let { message, showBubbleTail = true, isMyself }: Props = $props();
</script>

<div class={tw('mb-1.5 flex items-end gap-2 px-2', isMyself && 'flex-row-reverse')}>
	<div
		class={tw(
			'relative flex-1',
			isMyself
				? '[--weblah-chat-bubble-bg:var(--color-accent-100)] [--weblah-chat-bubble-stroke:var(--color-accent-200)] dark:[--weblah-chat-bubble-bg:var(--color-accent-900)] dark:[--weblah-chat-bubble-stroke:var(--color-accent-950)]'
				: '[--weblah-chat-bubble-bg:var(--color-sb-primary)] [--weblah-chat-bubble-stroke:var(--color-ss-secondary)]',
			isMyself && 'text-end'
		)}
	>
		<div
			class={tw(
				`relative inline-block max-w-[85%] rounded-2xl bg-(--weblah-chat-bubble-bg) shadow-xs ring-1 ring-(--weblah-chat-bubble-stroke)`,
				showBubbleTail && [
					// ::before: Fill of chat bubble tail
					'before:absolute before:-bottom-[1px] before:box-content before:h-6 before:w-5 before:border-(--weblah-chat-bubble-bg) before:text-(--weblah-chat-bubble-stroke)',
					isMyself
						? 'before:-end-5 before:rounded-es-[16px_12px] before:border-s-[10px] before:drop-shadow-[1px_0]'
						: `before:-start-5 before:rounded-ee-[16px_12px] before:border-e-[10px] before:drop-shadow-[-1px_0]`,
					// ::after: Stroke of chat bubble tail
					'after:absolute after:-bottom-[1px] after:-z-10 after:box-content after:h-6 after:w-5 after:text-(--weblah-chat-bubble-stroke)',
					isMyself
						? 'after:-end-5 after:rounded-es-[16px_12px] after:border-s-[10px] after:drop-shadow-[0_1px]'
						: `after:-start-5 after:rounded-ee-[16px_12px] after:border-e-[10px] after:drop-shadow-[0_1px]`
				],
				'sm:max-w-[70%] lg:max-w-[50%]',
				isMyself && 'text-start'
			)}
		>
			<RichTextRenderer
				content={message.content}
				class="z-10 select-text overflow-hidden rounded-2xl px-3 py-2"
			/>
		</div>
	</div>
</div>

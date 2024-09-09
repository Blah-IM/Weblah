<script lang="ts">
	import { AvatarBeam } from 'svelte-boring-avatars';

	import { formatMessageDate, formatUnreadCount } from '$lib/formatters';
	import type { Chat } from '$lib/types';
	import { currentKeyPair } from '$lib/keystore';
	import { blahRichTextToPlainText } from '$lib/richText';
	import { page } from '$app/stores';
	import { tw } from '$lib/tw';

	export let chat: Chat;

	let urlSafeEndpoint: string;
	$: {
		const url = new URL(chat.server);
		urlSafeEndpoint = encodeURIComponent(url.hostname + url.pathname);
	}

	$: isSelected = $page.params.chatId === chat.id;
</script>

<li
	class={tw(
		'relative after:absolute after:bottom-0 after:end-0 after:start-14 after:border-t-[0.5px] after:border-ss-secondary',
		isSelected && 'bg-accent-100 shadow-inner dark:bg-accent-950'
	)}
>
	<a
		tabindex="-1"
		href="/chats/{urlSafeEndpoint}/{chat.id}"
		class="flex h-20 cursor-default items-center gap-2 px-2"
	>
		<div class="size-10">
			<AvatarBeam size={40} name={chat.name} />
		</div>
		<div class="relative min-w-0 flex-1">
			<div class="flex items-center gap-1">
				<h3 class="flex-1 truncate text-sm font-semibold">{chat.name}</h3>
				{#if chat.lastMessage}
					<time
						class="truncate text-xs text-sf-tertiary"
						datetime={chat.lastMessage.date.toISOString()}
						title={formatMessageDate(chat.lastMessage.date, true)}
					>
						{formatMessageDate(chat.lastMessage.date)}
					</time>
				{/if}
			</div>
			<div class="flex items-end gap-1">
				<p class="line-clamp-2 h-[2.5em] flex-1 text-sm leading-tight text-sf-secondary">
					{#if chat.lastMessage}
						{#if chat.id !== chat.lastMessage.sender.id}
							<span class="text-sf-primary">
								{chat.lastMessage.sender.id === $currentKeyPair.id
									? 'You'
									: chat.lastMessage.sender.name}:
							</span>
						{/if}
						{blahRichTextToPlainText(chat.lastMessage.content)}
					{/if}
				</p>
				{#if chat.unreadCount}
					<span
						class="whitespace-nowrap rounded-full bg-slate-400 px-1.5 py-0.5 text-xs text-slate-50 dark:bg-slate-500 dark:text-slate-950"
					>
						{formatUnreadCount(chat.unreadCount)}
					</span>
				{/if}
			</div>
		</div>
	</a>
</li>

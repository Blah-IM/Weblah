<script lang="ts">
	import { AvatarBeam } from 'svelte-boring-avatars';

	import { formatMessageDate, formatFullMessageDate, formatUnreadCount } from '$lib/formatters';
	import type { Chat } from '$lib/types';
	import accountManager from '$lib/accounts/manager.svelte';
	import { toPlainText } from '@blah-im/core/richText';
	import { page } from '$app/state';
	import { tw } from '$lib/tw';

	interface Props {
		chat: Chat;
	}

	let { chat }: Props = $props();

	function urlSafeEndpointForChat(chat: Chat) {
		const url = new URL(chat.server);
		return encodeURIComponent(url.hostname + url.pathname);
	}

	let urlSafeEndpoint = $derived(urlSafeEndpointForChat(chat));

	let isSelected = $derived(page.params.chatId === chat.id);
</script>

<li
	class={tw(
		'after:border-ss-secondary relative after:absolute after:start-14 after:end-0 after:bottom-0 after:border-t-[0.5px]',
		isSelected && 'bg-accent-100 dark:bg-accent-950 shadow-inner'
	)}
>
	<a
		tabindex="0"
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
						class="text-sf-tertiary truncate text-xs"
						datetime={chat.lastMessage.date.toISOString()}
						title={formatFullMessageDate(chat.lastMessage.date)}
					>
						{formatMessageDate(chat.lastMessage.date)}
					</time>
				{/if}
			</div>
			<div class="flex items-end gap-1">
				<p class="text-sf-secondary line-clamp-2 h-[2.5em] flex-1 text-sm leading-tight">
					{#if chat.lastMessage}
						{#if chat.id !== chat.lastMessage.sender.id}
							<span class="text-sf-primary">
								{chat.lastMessage.sender.id === accountManager.currentAccountId
									? 'You'
									: chat.lastMessage.sender.name}:
							</span>
						{/if}
						{toPlainText(chat.lastMessage.content)}
					{/if}
				</p>
				{#if chat.unreadCount}
					<span
						class="rounded-full bg-slate-400 px-1.5 py-0.5 text-xs whitespace-nowrap text-slate-50 dark:bg-slate-500 dark:text-slate-950"
					>
						{formatUnreadCount(chat.unreadCount)}
					</span>
				{/if}
			</div>
		</div>
	</a>
</li>

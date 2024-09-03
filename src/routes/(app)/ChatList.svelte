<script>
	import { browser } from '$app/environment';
	import { useChatList } from '$lib/chatList';
	import { chatServerConnectionPool } from '$lib/chatServers';
	import ChatListHeader from './ChatListHeader.svelte';
	import ChatListItem from './ChatListItem.svelte';

	const chatList = browser ? useChatList(chatServerConnectionPool.chatList) : null;
</script>

<div class="flex h-[100dvh] flex-col justify-stretch">
	<ChatListHeader />
	<div class="min-h-0 flex-1 touch-pan-y overflow-y-auto">
		<ul>
			{#if $chatList}
				{#each $chatList as chat}
					<ChatListItem {chat} />
				{/each}
			{/if}
		</ul>
	</div>
</div>

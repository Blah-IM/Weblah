<script lang="ts">
	import { browser } from '$app/environment';
	import { useChatList } from '$lib/chatList';
	import { chatServerConnectionPool } from '$lib/chatServers';
	import { scale } from 'svelte/transition';
	import ChatListHeader from './ChatListHeader.svelte';
	import ChatListItem from './ChatListItem.svelte';
	import SearchPanel from './SearchPanel.svelte';

	const chatList = browser ? useChatList(chatServerConnectionPool.chatList) : null;

	let isSearchFocused: boolean = $state(false);
	let searchQuery: string = $state('');
</script>

<div class="flex h-[100dvh] flex-col justify-stretch">
	<ChatListHeader bind:isSearchFocused bind:searchQuery />
	<div class="relative min-h-0 flex-1 touch-pan-y overflow-y-auto">
		<ul>
			{#if $chatList}
				{#each $chatList as chat (chat.id)}
					<ChatListItem {chat} />
				{/each}
			{/if}
		</ul>
		{#if isSearchFocused || searchQuery}
			<div
				class="bg-sb-primary absolute inset-0 size-full origin-top touch-pan-y overflow-y-auto"
				transition:scale={{ start: 0.9 }}
			>
				<SearchPanel {searchQuery} />
			</div>
		{/if}
	</div>
</div>

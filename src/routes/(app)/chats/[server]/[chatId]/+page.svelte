<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';
	import { BlahChatServerConnection } from '$lib/blah/connection/chatServer';
	import { browser } from '$app/environment';
	import { chatServerConnectionPool } from '$lib/chatServers';
	import ServiceMessage from '$lib/components/ServiceMessage.svelte';
	import ChatPage from './ChatPage.svelte';
	import { useChat } from '$lib/chat';

	let roomId = $derived($page.params.chatId);

	let serverEndpoint: string = $state('');
	run(() => {
		const endpointString = decodeURIComponent($page.params.server);
		serverEndpoint = endpointString.startsWith('http')
			? endpointString
			: `https://${endpointString}`;
	});

	let server: BlahChatServerConnection | null = $state();
	run(() => {
		if (browser) {
			server = chatServerConnectionPool.getConnection(serverEndpoint);
		}
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if server}
		{@const { info, sectionedMessages, sendMessage } = useChat(server, roomId)}
		<ChatPage {info} {sectionedMessages} on:sendMessage={(e) => sendMessage(e.detail)} />
	{:else}
		<ServiceMessage>
			To view this chat, you need to connect to chat server
			<span class="font-semibold">{serverEndpoint}</span>.
		</ServiceMessage>
	{/if}
</div>

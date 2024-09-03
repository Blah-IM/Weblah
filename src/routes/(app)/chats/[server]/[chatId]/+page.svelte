<script lang="ts">
	import { page } from '$app/stores';
	import BgPattern from '$lib/components/BgPattern.svelte';
	import { messageFromBlah, type Chat, type Message } from '$lib/types';
	import { onDestroy } from 'svelte';
	import ChatHeader from './ChatHeader.svelte';
	import ChatHistory from './ChatHistory.svelte';
	import ChatInput from './ChatInput.svelte';
	import { BlahChatServerConnection } from '$lib/blah/connection/chatServer';
	import { currentKeyPair } from '$lib/keystore';
	import { BlahKeyPair, type EncodedBlahKeyPair } from '$lib/blah/crypto';
	import { browser } from '$app/environment';
	import { chatServerConnectionPool } from '$lib/chatServers';
	import ServiceMessage from '$lib/components/ServiceMessage.svelte';
	import ChatPage from './ChatPage.svelte';

	$: roomId = $page.params.chatId;

	let serverEndpoint: string = '';
	$: {
		const endpointString = decodeURIComponent($page.params.server);
		serverEndpoint = endpointString.startsWith('http')
			? endpointString
			: `https://${endpointString}`;
	}

	let server: BlahChatServerConnection | null;
	$: {
		if (browser) {
			server = chatServerConnectionPool.getConnection(serverEndpoint);
		}
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if server}
		{@const { info, messages, sendMessage } = server.chat(roomId)}
		<ChatPage {info} {messages} on:sendMessage={sendMessage} />
	{:else}
		<ServiceMessage>
			To view this chat, you need to connect to chat server
			<span class="font-semibold">{serverEndpoint}</span>.
		</ServiceMessage>
	{/if}
</div>

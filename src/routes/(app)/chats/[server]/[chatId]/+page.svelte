<script lang="ts">
	import { page } from '$app/state';
	import { BlahChatServerConnection } from '$lib/blah/connection/chatServer';
	import { chatServerConnectionPool } from '$lib/chatServers';
	import ServiceMessage from '$lib/components/ServiceMessage.svelte';
	import ChatPage from './ChatPage.svelte';
	import { useChat } from '$lib/chat';

	let roomId = $derived(page.params.chatId);

	let serverEndpoint: string = $derived(normalizedServerEndpoint(page.params.server));
	function normalizedServerEndpoint(serverURIComponent: string) {
		const endpointString = decodeURIComponent(serverURIComponent);
		return endpointString.startsWith('http') ? endpointString : `https://${endpointString}`;
	}

	let server: BlahChatServerConnection | null = $state(null);
	$effect.pre(() => {
		server = chatServerConnectionPool.getConnection(serverEndpoint);
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if server}
		{@const { sendMessage, ...rest } = useChat(server, roomId)}
		<ChatPage {...rest} onSendMessage={sendMessage} />
	{:else}
		<ServiceMessage>
			To view this chat, you need to connect to chat server
			<span class="font-semibold">{serverEndpoint}</span>.
		</ServiceMessage>
	{/if}
</div>

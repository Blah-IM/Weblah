<script lang="ts">
	import { page } from '$app/stores';
	import BgPattern from '$lib/components/BgPattern.svelte';
	import { createRandomMessage } from '$lib/mock/messages';
	import { messageFromBlah, type Chat, type Message } from '$lib/types';
	import { onMount } from 'svelte';
	import ChatHeader from './ChatHeader.svelte';
	import ChatHistory from './ChatHistory.svelte';
	import ChatInput from './ChatInput.svelte';
	import { BlahChatServerConnection } from '$lib/blah/connection/chatServer';

	const roomId = $page.params.chatId;

	let chat: Chat = {
		id: roomId,
		name: '',
		type: 'group'
	};
	let messages: Message[] = [];

	async function loadChat(server: BlahChatServerConnection) {
		const { room, messages: blahMessages } = await server.fetchRoom(roomId);
		chat = {
			id: roomId,
			name: room.title,
			type: 'group'
		};
		messages = [...blahMessages.map(messageFromBlah), ...messages];
	}

	onMount(() => {
		const server = new BlahChatServerConnection('https://blah.oxa.li/api');
		loadChat(server);
		return server.subscribeRoom(roomId, (message) => {
			messages = [...messages, messageFromBlah(message)];
		});
	});
</script>

<div class="flex h-full w-full flex-col justify-stretch">
	<ChatHeader {chat} outsideUnreadCount={263723} />
	<BgPattern class="flex-1" pattern="charlieBrown">
		<ChatHistory {messages} mySenderId={'_send'} />
	</BgPattern>
	<ChatInput />
</div>

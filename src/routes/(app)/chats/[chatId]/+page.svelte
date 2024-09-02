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

	const roomId = $page.params.chatId;

	let chat: Chat = {
		id: roomId,
		name: '',
		type: 'group'
	};
	let messages: Message[] = [];
	let server: BlahChatServerConnection;
	let unsubscribe: () => void = () => {};

	async function initConnection(encodedKeyPair?: EncodedBlahKeyPair) {
		messages = [];
		const keyPair = encodedKeyPair ? await BlahKeyPair.fromEncoded(encodedKeyPair) : undefined;
		server = new BlahChatServerConnection('https://blah.oxa.li/api', keyPair);
		unsubscribe();
		unsubscribe = server.subscribeRoom(roomId, (message) => {
			messages = [...messages, messageFromBlah(message)];
		}).unsubscribe;
		return server;
	}

	async function loadChat(server: BlahChatServerConnection) {
		const { room, messages: blahMessages } = await server.fetchRoom(roomId);
		chat = {
			id: roomId,
			name: room.title,
			type: 'group'
		};
		messages = [...blahMessages.map(messageFromBlah), ...messages];
	}

	$: if (browser) initConnection($currentKeyPair).then((server) => loadChat(server));

	onDestroy(() => unsubscribe());
</script>

<div class="flex h-full w-full flex-col justify-stretch">
	<ChatHeader {chat} outsideUnreadCount={263723} />
	<BgPattern class="flex-1" pattern="charlieBrown">
		<ChatHistory {messages} mySenderId={$currentKeyPair?.id} />
	</BgPattern>
	<ChatInput {roomId} {server} />
</div>

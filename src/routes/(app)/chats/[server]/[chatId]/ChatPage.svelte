<script lang="ts">
	import type { Readable } from 'svelte/store';

	import type { Chat, Message } from '$lib/types';
	import BgPattern from '$lib/components/BgPattern.svelte';
	import { currentKeyPair } from '$lib/keystore';

	import ChatHeader from './ChatHeader.svelte';
	import ChatHistory from './ChatHistory.svelte';
	import ChatInput from './ChatInput.svelte';
	import type { BlahRichText } from '$lib/richText';
	import type { MessageSection } from '$lib/chat';

	export let info: Readable<Chat>;
	export let sectionedMessages: Readable<MessageSection[]>;

	interface $$Events {
		sendMessage: CustomEvent<BlahRichText>;
	}
</script>

<ChatHeader info={$info} outsideUnreadCount={263723} />
<BgPattern class="w-full flex-1" pattern="charlieBrown">
	<ChatHistory sectionedMessages={$sectionedMessages} mySenderId={$currentKeyPair?.id} />
</BgPattern>
<ChatInput on:sendMessage />

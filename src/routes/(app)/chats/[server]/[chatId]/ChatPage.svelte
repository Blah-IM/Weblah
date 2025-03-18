<script lang="ts">
	import type { Readable } from 'svelte/store';

	import type { Chat } from '$lib/types';
	import BgPattern from '$lib/components/BgPattern.svelte';
	import { currentKeyPair } from '$lib/keystore';

	import ChatHeader from './ChatHeader.svelte';
	import ChatHistory from './ChatHistory.svelte';
	import ChatInput from './ChatInput.svelte';
	import type { BlahRichText } from '@blah-im/core/richText';
	import type { MessageSection } from '$lib/chat';

	interface Props {
		info: Readable<Chat>;
		sectionedMessages: Readable<MessageSection[]>;
		onSendMessage: (brt: BlahRichText) => void;
	}

	let { info, sectionedMessages, onSendMessage }: Props = $props();
</script>

<ChatHeader info={$info} outsideUnreadCount={263723} />
<BgPattern class="w-full flex-1" pattern="charlieBrown">
	<ChatHistory sectionedMessages={$sectionedMessages} mySenderId={$currentKeyPair?.id} />
</BgPattern>
<ChatInput {onSendMessage} />

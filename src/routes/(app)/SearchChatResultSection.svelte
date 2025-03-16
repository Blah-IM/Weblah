<script lang="ts">
	import type { Chat } from '$lib/types';

	import ChatListItem from './ChatListItem.svelte';

	interface Props {
		name: string;
		results: Chat[];
	}

	let { name, results }: Props = $props();
</script>

<li>
	<h3
		class="border-ss-secondary text-sf-secondary ms-2 border-b-[0.5px] pe-2 pt-2 pb-1 text-xs font-semibold uppercase"
	>
		{name}
	</h3>
	<ul>
		{#each results as chat (chat.id)}
			<ChatListItem {chat} />
		{/each}
	</ul>
</li>

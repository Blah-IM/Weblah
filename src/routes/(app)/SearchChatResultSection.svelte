<script lang="ts">
	import type { Chat } from '$lib/types';

	import ChatListItem from './ChatListItem.svelte';

	export let name: string;
	export let results: Chat[];
</script>

<li>
	<h3
		class="ms-2 border-b-[0.5px] border-ss-secondary pb-1 pe-2 pt-2 text-xs font-semibold uppercase text-sf-secondary"
	>
		{name}
	</h3>
	<ul>
		{#each results as chat}
			<ChatListItem {chat} />
		{/each}
	</ul>
</li>

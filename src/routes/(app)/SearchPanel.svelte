<script lang="ts">
	import { chatServerConnectionPool } from '$lib/chatServers';
	import { ChatBubbleLeftRight, Icon } from 'svelte-hero-icons';
	import SearchChatResultSection from './SearchChatResultSection.svelte';

	interface Props {
		searchQuery: string;
	}

	let { searchQuery }: Props = $props();

	async function search(query: string) {
		const results = await chatServerConnectionPool.searchManager.searchChats(query);
		return results;
	}
</script>

{#await search(searchQuery)}
	<div class="flex size-full items-center justify-center">
		<Icon src={ChatBubbleLeftRight} solid class="fill-sf-tertiary w-1/3 animate-pulse" />
	</div>
{:then results}
	{#if results.joined.length === 0 && results.public.length === 0}
		<div class="flex size-full items-center justify-center">
			<p class="text-sf-tertiary">No results found</p>
		</div>
	{:else}
		<ul>
			{#if results.joined.length > 0}
				<SearchChatResultSection name="Recents" results={results.joined} />
			{/if}
			{#if results.public.length > 0}
				<SearchChatResultSection name="Discover" results={results.public} />
			{/if}
		</ul>
	{/if}
{/await}

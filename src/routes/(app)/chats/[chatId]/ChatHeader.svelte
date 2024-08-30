<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { formatUnreadCount } from '$lib/formatters';
	import type { Chat } from '$lib/types';
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let chat: Chat;
	export let outsideUnreadCount = 0;
</script>

<div class="flex w-full gap-2 border-b border-ss-secondary bg-sb-primary p-2 shadow-sm">
	<Button href="/" class="rounded-full sm:hidden">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="-me-0.5 -ms-1 size-5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
		</svg>
		{#if outsideUnreadCount}
			<span class="text-xs text-sf-tertiary">{formatUnreadCount(outsideUnreadCount)}</span>
		{/if}
		<span class="sr-only">Back</span>
	</Button>
	<div class="flex flex-1 flex-col justify-center text-center">
		<h3 class="truncate text-sm font-semibold">{chat.name}</h3>
	</div>
	<AvatarBeam size={30} name={chat.name} />
</div>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { formatUnreadCount } from '$lib/formatters';
	import type { Chat } from '$lib/types';
	import { AvatarBeam } from 'svelte-boring-avatars';
	import { ChevronLeft, Icon } from 'svelte-hero-icons';

	export let info: Chat;
	export let outsideUnreadCount = 0;
</script>

<div
	class="relative z-10 box-border flex min-h-[calc(3rem+1px)] w-full items-center gap-2 border-b border-ss-secondary bg-sb-primary p-2 shadow-sm"
>
	<Button href="/" class="rounded-full sm:hidden">
		<Icon src={ChevronLeft} />
		{#if outsideUnreadCount}
			<span class="text-xs text-sf-tertiary">{formatUnreadCount(outsideUnreadCount)}</span>
		{/if}
		<span class="sr-only">Back</span>
	</Button>
	<div class="flex flex-1 flex-col justify-center text-center sm:order-2 sm:text-start">
		<h3 class="truncate text-sm font-semibold">{info.name}</h3>
	</div>
	<div class="sm:order-1">
		<AvatarBeam size={32} name={info.id} />
	</div>

	<a class="absolute inset-y-0 start-0 hidden w-2 cursor-default sm:block" href="/">
		<span class="sr-only">Back</span>
	</a>
	<Button class="order-3 hidden size-8 p-0 sm:inline-flex">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
			<path
				fill-rule="evenodd"
				d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
				clip-rule="evenodd"
			/>
		</svg>
		<span class="sr-only">Search</span>
	</Button>
	<Button class="order-3 hidden size-8 p-0 sm:inline-flex">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
			/>
		</svg>

		<span class="sr-only">Options</span>
	</Button>
</div>

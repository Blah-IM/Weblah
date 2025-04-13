<script lang="ts">
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import ChatList from './ChatList.svelte';
	import SettingsList from './settings/SettingsList.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition || navigation.from?.url.href === navigation.to?.url.href)
			return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let isSettings = $derived($page.route.id?.startsWith('/(app)/settings') ?? true);
	let mainVisible = $derived(
		!!$page.params.chatId || (isSettings && $page.route.id !== '/(app)/settings')
	);
</script>

<div
	class="group h-screen sm:flex sm:items-stretch"
	data-weblah-main-visible={mainVisible ? 'true' : undefined}
>
	<aside
		class="border-ss-primary bg-sb-primary relative h-[100dvh] min-h-0 overflow-hidden shadow-lg [view-transition-name:chat-list] after:pointer-events-none after:absolute after:inset-0 after:size-full after:bg-transparent group-data-weblah-main-visible:after:bg-black/30 sm:w-1/3 sm:border-e sm:after:hidden lg:w-1/4"
	>
		<ChatList />
		{#if isSettings}
			<SettingsList class="absolute inset-0 z-10 size-full origin-top-left" />
		{/if}
	</aside>
	{#if mainVisible}
		<main
			class="bg-sb-secondary absolute inset-0 w-full shadow-lg [view-transition-name:main] sm:relative sm:flex-1 sm:shadow-none"
		>
			{@render children?.()}
		</main>
	{:else}
		<div class="hidden flex-1 sm:block">{@render children?.()}</div>
	{/if}
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes slide-out {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(100%);
		}
	}

	@keyframes float-in {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes float-out {
		from {
			transform: scale(1);
			opacity: 1;
		}
		to {
			transform: scale(0.9);
			opacity: 0;
		}
	}

	:root::view-transition-old(root),
	:root::view-transition-new(root) {
		animation-duration: 250ms;
	}
	:root::view-transition-old(main) {
		animation: 250ms ease-out slide-out;
	}
	:root::view-transition-new(main) {
		animation: 250ms ease-out slide-in;
	}
	:root::view-transition-old(settings-list),
	:root::view-transition-new(settings-list) {
		transform-origin: top left;
	}
	:root::view-transition-old(settings-list) {
		animation: 250ms ease-out float-out;
	}
	:root::view-transition-new(settings-list) {
		animation: 250ms ease-out float-in;
	}
</style>

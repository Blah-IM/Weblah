<script>
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import ChatList from './ChatList.svelte';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$: mainVisible =
		!!$page.params.chatId ||
		($page.route.id?.startsWith('/settings') &&
			!$page.route.id?.startsWith('/settings/_mobile_empty'));
</script>

<div
	class="group h-screen sm:flex sm:items-stretch"
	data-weblah-main-visible={mainVisible ? 'true' : undefined}
>
	<aside
		class="relative h-[100dvh] min-h-0 overflow-hidden border-ss-primary bg-sb-primary shadow-lg [view-transition-name:chat-list] after:pointer-events-none after:absolute after:inset-0 after:size-full after:bg-transparent group-data-[weblah-main-visible]:after:bg-black/30 sm:w-1/3 sm:border-e sm:after:hidden lg:w-1/4"
	>
		<ChatList />
	</aside>
	{#if mainVisible}
		<main
			class="absolute inset-0 w-full bg-sb-secondary shadow-lg [view-transition-name:main] sm:relative sm:flex-1 sm:shadow-none"
		>
			<slot></slot>
		</main>
	{:else}
		<div class="hidden flex-1 sm:block"><slot /></div>
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
</style>

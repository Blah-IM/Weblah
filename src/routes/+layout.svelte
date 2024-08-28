<script>
	import '../app.css';
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
</script>

<div
	class="group h-screen sm:flex sm:items-stretch"
	data-weblah-main-visible={$page.params.chatId ? 'true' : undefined}
>
	<aside
		class="h-screen min-h-0 overflow-hidden border-slate-300 bg-white shadow-lg sm:w-1/3 sm:border-e lg:w-1/4 dark:bg-black"
	>
		<ChatList />
	</aside>
	<main
		class="absolute inset-0 w-full translate-x-[110vw] bg-slate-100 shadow-lg transition-transform duration-300 group-data-[weblah-main-visible]:translate-x-0 sm:relative sm:flex-1 sm:translate-x-0 dark:bg-slate-900"
	>
		<slot></slot>
	</main>
</div>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputFrame from '$lib/components/InputFrame.svelte';
	import { Icon, MagnifyingGlass, PencilSquare, XCircle } from 'svelte-hero-icons';
	import IdentityMenu from './IdentityMenu.svelte';
	import { tw } from '$lib/tw';
	import { tick } from 'svelte';

	export let searchQuery: string = '';
	export let isSearchFocused: boolean;

	let inputElement: HTMLInputElement;

	function onTapX() {
		searchQuery = '';
		inputElement.blur();
	}
</script>

<header class="flex items-center justify-stretch gap-2 border-b border-ss-secondary p-2 shadow-sm">
	<IdentityMenu class={tw('transition-opacity duration-200', isSearchFocused && 'opacity-0')} />
	<InputFrame class={tw('z-10 flex-1 transition-all duration-200', isSearchFocused && '-mx-10')}>
		<Icon src={MagnifyingGlass} class="size-5 text-slate-400" />
		<input
			type="text"
			placeholder="Search"
			class="w-full flex-1 bg-transparent text-sm leading-4 text-slate-900 focus:outline-none"
			bind:value={searchQuery}
			bind:this={inputElement}
			on:focus={() => (isSearchFocused = true)}
			on:blur={async () => {
				await tick();
				isSearchFocused = false;
			}}
		/>
		<button
			class={tw(
				'size-4 cursor-default text-slate-300 opacity-0 transition-opacity dark:text-slate-500',
				isSearchFocused && 'opacity-100'
			)}
			on:click={onTapX}
		>
			<Icon src={XCircle} mini />
			<span class="sr-only">Clear</span>
		</button>
	</InputFrame>
	<Button class={tw('size-8 transition-opacity duration-200', isSearchFocused && 'opacity-0')}>
		<Icon src={PencilSquare} class="size-5" />
		<span class="sr-only">Compose</span>
	</Button>
</header>

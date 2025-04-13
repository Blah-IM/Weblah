<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputFrame from '$lib/components/InputFrame.svelte';
	import { Icon, MagnifyingGlass, PencilSquare, XCircle } from 'svelte-hero-icons';
	import { tw } from '$lib/tw';
	import CurrentAccountIndicator from './CurrentAccountIndicator.svelte';

	interface Props {
		searchQuery?: string;
		isSearchFocused: boolean;
	}

	let { searchQuery = $bindable(''), isSearchFocused = $bindable() }: Props = $props();

	function onTapClear(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		searchQuery = '';
	}
</script>

<header class="border-ss-secondary flex items-center justify-stretch gap-2 border-b p-2 shadow-xs">
	<CurrentAccountIndicator
		class={tw(
			'transition-[opacity,transform] duration-200',
			isSearchFocused && '-translate-x-full opacity-0'
		)}
	/>
	<InputFrame
		class={tw('z-10 h-8 flex-1 transition-all duration-200', isSearchFocused && '-mx-10')}
	>
		<Icon src={MagnifyingGlass} class="size-5 text-slate-400" />
		<input
			type="search"
			placeholder="Search"
			class="text-sf-primary w-full flex-1 bg-transparent text-sm leading-4 focus:outline-hidden"
			bind:value={searchQuery}
			onfocus={() => {
				isSearchFocused = true;
			}}
			onblur={(e) => {
				// If the related target is an anchor element, trigger the click as the user is trying to navigate
				if (
					e.relatedTarget instanceof HTMLAnchorElement ||
					e.relatedTarget instanceof HTMLButtonElement
				) {
					e.relatedTarget.click();
				}
				isSearchFocused = false;
			}}
		/>
		<button
			tabindex="0"
			class={tw(
				'-mx-2 -my-1.5 flex size-8 cursor-text items-center justify-center text-slate-300 opacity-0 transition-[opacity,transform] duration-200 dark:text-slate-500',
				isSearchFocused && 'translate-x-full cursor-default opacity-100'
			)}
			onclick={onTapClear}
		>
			<Icon src={XCircle} class="size-4" mini />
			<span class="sr-only">Clear</span>
		</button>
	</InputFrame>
	<Button class={tw('size-8 transition-opacity duration-200', isSearchFocused && 'opacity-0')}>
		<Icon src={PencilSquare} class="size-5" />
		<span class="sr-only">Compose</span>
	</Button>
</header>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputFrame from '$lib/components/InputFrame.svelte';
	import IdentityMenu from './IdentityMenu.svelte';
</script>

<header class="flex items-center justify-stretch gap-2 border-b border-ss-secondary p-2 shadow-sm">
	<IdentityMenu />
	<InputFrame class="flex-1">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="size-5 text-slate-400"
		>
			<path
				fill-rule="evenodd"
				d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
				clip-rule="evenodd"
			/>
		</svg>
		<input
			type="text"
			placeholder="Search"
			class="w-full flex-1 bg-transparent text-sm leading-4 text-slate-900 focus:outline-none"
		/>
	</InputFrame>
	<Button class="size-8">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
			/>
		</svg>
		<span class="sr-only">Compose</span>
	</Button>
</header>

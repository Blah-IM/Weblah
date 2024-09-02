<script lang="ts">
	import { browser } from '$app/environment';
	import type { Delta } from 'typewriter-editor';
	import InputFrame from '$lib/components/InputFrame.svelte';
	import { tw } from '$lib/tw';

	export let delta: Delta | null = null;
	export let plainText: string | undefined = undefined;
	export let placeholder: string = '';

	let className = '';
	export { className as class };

	const loadClientComponent = async () => {
		if (!browser) return;
		const { default: ClientInput } = await import('./RichTextInput/ClientInput.svelte');
		return ClientInput;
	};
</script>

<InputFrame class={tw('overflow-y-auto', className)}>
	{#await loadClientComponent()}
		<div class="rich-text opacity-50">
			<p>{placeholder}</p>
		</div>
	{:then Input}
		<svelte:component this={Input} bind:delta bind:plainText {placeholder} on:keydown>
			<slot />
		</svelte:component>
	{/await}
</InputFrame>

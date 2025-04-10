<script lang="ts">
	import { browser } from '$app/environment';
	import InputFrame from '$lib/components/InputFrame.svelte';
	import type { Props as ClientInputProps } from './RichTextInput/ClientInput.svelte';
	import { tw } from '$lib/tw';

	interface Props extends ClientInputProps {
		class?: string;
	}

	let { class: className = '', placeholder, children, ...clientInputProps }: Props = $props();

	const loadClientComponent = async () => {
		if (!browser) return;
		const { default: ClientInput } = await import('./RichTextInput/ClientInput.svelte');
		return ClientInput;
	};
</script>

<InputFrame class={tw('overflow-y-auto', className)}>
	{#await loadClientComponent()}
		<div class="rich-text">
			{#if children}
				{@render children()}
			{:else}
				<p class="opacity-50">{placeholder}</p>
			{/if}
		</div>
	{:then ClientInput}
		<ClientInput {placeholder} {...clientInputProps}>
			{@render children?.()}
		</ClientInput>
	{/await}
</InputFrame>

<script lang="ts">
	import { browser } from '$app/environment';
	import type { Delta, Editor } from 'typewriter-editor';
	import InputFrame from '$lib/components/InputFrame.svelte';
	import { tw } from '$lib/tw';


	interface Props {
		delta?: Delta | null;
		plainText?: string | undefined;
		keyboardSubmitMethod?: 'enter' | 'shiftEnter' | undefined;
		placeholder?: string;
		editor: Editor | undefined;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		delta = $bindable(null),
		plainText = $bindable(undefined),
		keyboardSubmitMethod = undefined,
		placeholder = '',
		editor = $bindable(),
		class: className = '',
		children
	}: Props = $props();
	

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
		<Input
			bind:delta
			bind:plainText
			{placeholder}
			bind:editor
			{keyboardSubmitMethod}
			on:keyboardSubmit
		>
			{@render children?.()}
		</Input>
	{/await}
</InputFrame>

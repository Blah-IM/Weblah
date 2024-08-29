<script lang="ts">
	import { browser } from '$app/environment';
	import type { Delta } from 'typewriter-editor';

	export let delta: Delta;

	let className = '';
	export { className as class };

	const loadClientComponent = async () => {
		if (!browser) return;
		const { default: ClientInput } = await import('./RichTextInput/ClientInput.svelte');
		return ClientInput;
	};
</script>

{#await loadClientComponent() then Input}
	<svelte:component this={Input} bind:delta class={className}><slot /></svelte:component>
{/await}

<script lang="ts">
	import { tw } from '$lib/tw';
	import { Dialog } from 'bits-ui';
	import { fade, fly } from 'svelte/transition';

	const { Root, Overlay, Portal, Content } = Dialog;

	interface Props {
		open: boolean;
		children?: import('svelte').Snippet;
		class?: string;
	}

	let { open = $bindable(false), children, class: className }: Props = $props();
</script>

<Root bind:open>
	<Portal>
		<Overlay forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} class="fixed inset-0 z-50 bg-black/50" transition:fade></div>
				{/if}
			{/snippet}
		</Overlay>
		<Content forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div
						{...props}
						class={tw(
							'bg-sb-secondary border-ss-secondary shadow-3xl fixed inset-1/2 z-50 -translate-1/2 overflow-hidden rounded-lg border sm:min-h-64 sm:min-w-lg',
							className
						)}
						transition:fly={{ y: -25 }}
					>
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</Content>
	</Portal>
</Root>

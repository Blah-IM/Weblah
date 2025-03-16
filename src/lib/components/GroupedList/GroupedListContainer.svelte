<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="mx-auto max-w-3xl">{@render children?.()}</div>

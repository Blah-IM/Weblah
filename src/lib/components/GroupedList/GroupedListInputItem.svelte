<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<label
	class="flex gap-2 px-4 py-3 font-medium text-sf-primary [align-items:first_baseline] [&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-end [&>input]:outline-hidden [&>input]:placeholder:opacity-50"
>
	{@render children?.()}
</label>

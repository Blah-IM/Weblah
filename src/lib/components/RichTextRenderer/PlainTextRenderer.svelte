<script lang="ts">
	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

{#each text.split('\n') as segment, idx}
	{#if idx > 0}
		<br />
	{/if}
	{segment}
{/each}

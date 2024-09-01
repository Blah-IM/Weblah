<script lang="ts">
	export let text: string;
</script>

{#each text.split('\n') as segment, idx}
	{#if idx > 0}
		<br />
	{/if}
	{segment}
{/each}

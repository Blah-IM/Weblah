<script lang="ts">
	import { GroupedListContainer, GroupedListSection } from '$lib/components/GroupedList';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader><h3 class="flex-1">Sign in</h3></PageHeader>

<GroupedListContainer>
	<GroupedListSection>
		{#snippet footer()}
				<p >New here? <a class="text-accent-500" href="new">Create a new account</a>.</p>
			{/snippet}
	</GroupedListSection>
</GroupedListContainer>

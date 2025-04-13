<script lang="ts">
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from 'bits-ui';
	import accountsManager from '$lib/accounts/manager.svelte';

	const currentAccount = $derived(accountsManager.currentAccount);
</script>

{#if currentAccount}
	<PageHeader>
		<h3 class="flex-1">{currentAccount.profile.signee.payload.name}</h3>
	</PageHeader>
{/if}

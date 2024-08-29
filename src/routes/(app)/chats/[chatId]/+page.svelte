<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
</script>

<p><Button href="/">Close</Button> History Page for {$page.params.chatId}</p>

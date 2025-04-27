<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Link from '$lib/components/Link.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { identityDescriptionFilePath, idURLToUsername } from '$lib/idURL';
	import type { BlahIdentity } from '@blah-im/core/identity';

	interface Props {
		open: boolean;
		url: string;
		identity: BlahIdentity;
	}

	let { open = $bindable(), url, identity }: Props = $props();

	const username = $derived(idURLToUsername(url));
	const profileDescriptionString = $derived(
		JSON.stringify(identity.generateIdentityDescription(), null, 2)
	);

	let copied = $state(false);
	let jsonFileBlobHref: string | null = $state(null);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(profileDescriptionString);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	};

	$effect.pre(() => {
		if (identity) {
			const blob = new Blob([profileDescriptionString], { type: 'application/json' });
			jsonFileBlobHref = URL.createObjectURL(blob);
		}

		return () => {
			if (jsonFileBlobHref) URL.revokeObjectURL(jsonFileBlobHref);
		};
	});
</script>

<Dialog bind:open class="flex h-2/3 flex-col">
	<PageHeader>
		<h3 class="flex-1">Setup Domain {username}</h3>
		<Button variant="primary" onclick={() => (open = false)}>Done</Button>
	</PageHeader>

	<div class="flex grow flex-col gap-3 p-3">
		<p class="text-sf-primary px-4 text-sm">
			For others to validate ownership of your domain, make text file below available as
			<code>{identityDescriptionFilePath}</code>
			under your domain, and make sure it allows any cross domain requests.
			<Link href="/">Learn more...</Link>
		</p>
		<Card class="relative grow">
			<textarea
				readonly
				class="text-sf-primary block h-full w-full resize-none overflow-x-auto px-4 py-3 font-mono text-sm"
				value={profileDescriptionString}
			></textarea>

			<div class="absolute end-2 top-2">
				<Button onclick={copyToClipboard}>
					{#if copied}Copied!{:else}Copy{/if}
				</Button>
				{#if jsonFileBlobHref}
					<Button href={jsonFileBlobHref} download="identity.json">Download</Button>
				{/if}
			</div>
		</Card>
	</div>
</Dialog>

<script lang="ts">
	import * as DropdownMenu from '$lib/components/DropdownMenu';
	import { AvatarBeam } from 'svelte-boring-avatars';
	import { keyStore, currentKeyIndex } from '$lib/keystore';
	import { BlahKeyPair, generateName } from '$lib/blah/crypto';

	let currentKeyId: string | undefined;
	$: currentKeyId = $keyStore[$currentKeyIndex]?.id;
	$: currentKeyName = currentKeyId ? generateName(currentKeyId) : null;

	async function createKeyPair() {
		const newKeyPair = await BlahKeyPair.generate();
		const encoded = await newKeyPair.encode();
		$keyStore = [...$keyStore, encoded];
		$currentKeyIndex = $keyStore.length - 1;
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#if currentKeyId}
			<AvatarBeam size={30} name={currentKeyId} />
			<span class="sr-only">Using identity {currentKeyName}</span>
		{:else}
			<div
				class="box-border size-[30px] rounded-full border-2 border-dashed border-ss-primary"
				aria-hidden
			/>
			<span class="sr-only">Using no identity</span>
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		{#if $keyStore.length > 0}
			<DropdownMenu.RadioGroup bind:value={currentKeyId}>
				{#each $keyStore as { id }}
					{@const name = generateName(id)}
					<DropdownMenu.RadioItem value={id}>
						<AvatarBeam size={30} {name} />
						<span>{name}</span>
					</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
			<DropdownMenu.Separator />
		{/if}
		<DropdownMenu.Item on:click={createKeyPair}>Create new identity</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

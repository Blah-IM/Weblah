<script lang="ts">
	import * as DropdownMenu from '$lib/components/DropdownMenu';
	import { AvatarBeam } from 'svelte-boring-avatars';
	import { keyStore, currentKeyIndex } from '$lib/keystore';
	import { BlahKeyPair, generateName } from '$lib/blah/crypto';

	let currentKeyId: string | undefined;
	let currentKeyName: string | null;
	$: {
		currentKeyId = $keyStore[$currentKeyIndex]?.id;
		currentKeyName = currentKeyId ? generateName(currentKeyId) : null;
	}

	async function createKeyPair() {
		const newKeyPair = await BlahKeyPair.generate();
		const encoded = await newKeyPair.encode();
		$keyStore = [...$keyStore, encoded];
		$currentKeyIndex = $keyStore.length - 1;
	}

	function setCurrentKeyIndex(idx: string | undefined | null) {
		$currentKeyIndex = parseInt(idx ?? '0', 10);
	}
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger>
		{#if currentKeyId}
			{#key currentKeyId}
				<AvatarBeam size={30} name={currentKeyId} />
			{/key}
			<span class="sr-only">Using identity {currentKeyName}</span>
		{:else}
			<div
				class="box-border size-[30px] rounded-full border-2 border-dashed border-ss-primary"
				aria-hidden
			/>
			<span class="sr-only">Using no identity</span>
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="origin-top-left">
		{#if $keyStore.length > 0}
			<DropdownMenu.RadioGroup
				value={$currentKeyIndex.toString()}
				onValueChange={setCurrentKeyIndex}
			>
				{#each $keyStore as { id }, idx}
					{@const name = generateName(id)}
					<DropdownMenu.RadioItem value={idx.toString()}>
						<div class="flex items-center gap-2 py-0.5">
							<AvatarBeam size={24} name={id} />
							<span>{name}</span>
						</div>
					</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Manage identities</DropdownMenu.Item>
		{:else}
			<DropdownMenu.Item on:click={createKeyPair}>Create new identity</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>

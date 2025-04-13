<script lang="ts">
	import type { BlahIdentityDescription } from '@blah-im/core/identity';
	import { AvatarBeam } from 'svelte-boring-avatars';

	interface Props {
		identity: BlahIdentityDescription | undefined;
		size?: number;
	}

	let { identity, size = 32 }: Props = $props();
</script>

{#if identity}
	{#key identity.id_key}
		<AvatarBeam {size} name={identity.id_key} />
	{/key}
	<span class="sr-only">{identity.profile.signee.payload.name}</span>
{:else}
	<div
		class="border-ss-primary box-border size-(--weblah-profile-pic-size) rounded-full border-2 border-dashed"
		style:--weblah-profile-pic-size={`${size}px`}
		aria-hidden="true"
	></div>
	<span class="sr-only">Identity Unavailable</span>
{/if}

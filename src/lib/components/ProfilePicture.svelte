<script lang="ts">
	import type { Account } from '$lib/accounts/accountStore';
	import { AvatarBeam } from 'svelte-boring-avatars';

	interface Props {
		account: Account | undefined;
		size?: number;
	}

	let { account, size = 32 }: Props = $props();
</script>

{#if account}
	{#key account.id_key}
		<AvatarBeam {size} name={account.id_key} />
	{/key}
	<span class="sr-only">{account.profile.signee.payload.name}</span>
{:else}
	<div
		class="border-ss-primary box-border size-(--weblah-profile-pic-size) rounded-full border-2 border-dashed"
		style:--weblah-profile-pic-size={`${size}px`}
		aria-hidden="true"
	></div>
	<span class="sr-only">Account Unavailable</span>
{/if}

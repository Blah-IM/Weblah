<script lang="ts">
	import type { Account } from '$lib/accounts/accountStore';
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let account: Account | undefined;
	export let size: number = 32;
</script>

{#if account}
	{#key account.id_key}
		<AvatarBeam {size} name={account.id_key} />
	{/key}
	<span class="sr-only">{account.profile.signee.payload.name}</span>
{:else}
	<div
		class="box-border size-[--weblah-profile-pic-size] rounded-full border-2 border-dashed border-ss-primary"
		style:--weblah-profile-pic-size={`${size - 2}px`}
		aria-hidden
	/>
	<span class="sr-only">Account Unavailable</span>
{/if}

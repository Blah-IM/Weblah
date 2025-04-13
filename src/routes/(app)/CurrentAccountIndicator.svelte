<script lang="ts">
	import manager from '$lib/accounts/manager.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { tw } from '$lib/tw';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLAnchorElement> {
		class?: string;
	}

	const { class: classNames, ...rest }: Props = $props();

	const currentAccount = $derived(manager.currentAccount);
	const href = $derived(currentAccount ? '/settings/account/profile' : '/settings/account/add');
</script>

<a {href} class={tw('cursor-default', classNames)} {...rest}>
	<ProfilePicture identity={currentAccount} size={32} />
</a>

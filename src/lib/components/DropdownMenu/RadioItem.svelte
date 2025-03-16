<script lang="ts">
	import type { DropdownMenuRadioItemProps } from 'bits-ui';
	import { DropdownMenu } from 'bits-ui';
	import { Check, Icon } from 'svelte-hero-icons';

	type $$Props = DropdownMenuRadioItemProps;
	export let value: string;
</script>

<DropdownMenu.RadioItem
	class="flex cursor-default items-center gap-1 rounded-sm px-1.5 py-0.5 text-sf-primary transition-colors duration-200 hover:bg-accent-50 dark:hover:bg-white/5"
	{value}
	{...$$props}
>
	<DropdownMenu.RadioIndicator class="relative size-4">
		<Icon src={Check} class="size-full" micro />
	</DropdownMenu.RadioIndicator>
	<slot />
</DropdownMenu.RadioItem>

<script lang="ts">
	import { DropdownMenu, type DropdownMenuItemProps } from 'bits-ui';

	type $$Props = DropdownMenuItemProps;
</script>

<DropdownMenu.Item
	class="cursor-default rounded-sm px-1.5 py-0.5 text-sf-primary transition-colors duration-200 hover:bg-accent-50 group-has-data-melt-dropdown-menu-radio-group:ps-6 dark:hover:bg-white/5"
	on:click
	{...$$restProps}
>
	<slot />
</DropdownMenu.Item>

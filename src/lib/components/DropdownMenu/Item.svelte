<script lang="ts">
	import { DropdownMenu, type DropdownMenuItemProps } from 'bits-ui';
	interface Props extends DropdownMenuItemProps {
		children?: import('svelte').Snippet;
	}

	let { children, ...rest }: Props = $props();
</script>

<DropdownMenu.Item
	class="text-sf-primary hover:bg-accent-50 cursor-default rounded-sm px-1.5 py-0.5 transition-colors duration-200 group-has-data-melt-dropdown-menu-radio-group:ps-6 dark:hover:bg-white/5"
	{...rest}
>
	{@render children?.()}
</DropdownMenu.Item>

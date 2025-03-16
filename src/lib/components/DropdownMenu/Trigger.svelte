<script lang="ts">
	import { DropdownMenu, type DropdownMenuTriggerProps } from 'bits-ui';
	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { children, ...rest }: Props = $props();
	type $$Props = DropdownMenuTriggerProps;
</script>

<DropdownMenu.Trigger class="cursor-default" {...rest}>
	{@render children?.()}
</DropdownMenu.Trigger>

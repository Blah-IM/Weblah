<script lang="ts">
	import { DropdownMenu, type DropdownMenuTriggerProps } from 'bits-ui';
	type $$Props = DropdownMenuTriggerProps;
</script>

<DropdownMenu.Trigger class="cursor-default" {...$$restProps}>
	<slot />
</DropdownMenu.Trigger>

<script lang="ts">
	import { DropdownMenu, type DropdownMenuContentProps } from 'bits-ui';

	interface $$Props extends DropdownMenuContentProps {}
</script>

<DropdownMenu.Content
	class="bg-sb-overlay min-w-32 rounded-lg border border-ss-secondary p-1 shadow-xl"
	sideOffset={4}
	{...$$restProps}
>
	<slot />
</DropdownMenu.Content>

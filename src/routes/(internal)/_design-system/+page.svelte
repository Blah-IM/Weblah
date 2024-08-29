<script>
	import ColorPalette from './ColorPalette.svelte';
</script>

<div class="p-4">
	<h1 class="text-2xl">Colors</h1>

	<div class="flex">
		<div data-weblah-color-scheme="light">
			<ColorPalette title="Light" />
		</div>
		<div data-weblah-color-scheme="dark">
			<ColorPalette title="Dark" />
		</div>
	</div>
</div>

<script lang="ts">
	export let title: string = 'Color Palette';
</script>

<div class="rounded-xl bg-sb-secondary p-4 text-sf-primary">
	<h2 class="my-2 text-xl">{title}</h2>
	<div class="flex gap-4">
		<div class="w-32 rounded-md border border-ss-primary bg-sb-primary py-3 text-center">
			<div class="mb-3 border-b border-ss-secondary pb-3 shadow-sm">Primary BG</div>
			<p class="text-sf-secondary">Secondary FG</p>
			<p class="text-sf-tertiary">Tertiary FG</p>
		</div>
		<div class="w-32 rounded-md border border-ss-primary bg-sb-secondary py-3 text-center">
			<div class="mb-3 border-b border-ss-secondary pb-3 shadow-sm">Secondary BG</div>
			<p class="text-sf-secondary">Secondary FG</p>
			<p class="text-sf-tertiary">Tertiary FG</p>
		</div>
		<div class="w-32 rounded-md border border-ss-primary bg-sb-tertiary py-3 text-center">
			<div class="mb-3 border-b border-ss-secondary pb-3 shadow-sm">Tertiary BG</div>
			<p class="text-sf-secondary">Secondary FG</p>
			<p class="text-sf-tertiary">Tertiary FG</p>
		</div>
	</div>
</div>

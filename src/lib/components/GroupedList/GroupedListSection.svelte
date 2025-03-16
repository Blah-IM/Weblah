<section class="my-6 cursor-default px-4">
	{#if $$slots.header}
		<h3 class="mb-1 truncate px-4 text-sm font-medium uppercase text-sf-tertiary">
			<slot name="header" />
		</h3>
	{/if}
	<div
		class="divide-y-[0.5px] divide-ss-secondary overflow-hidden rounded-lg border-[0.5px] border-ss-secondary bg-sb-primary shadow-xs"
	>
		<slot />
	</div>
	{#if $$slots.footer}
		<div class="mt-1 px-4 text-sm text-sf-tertiary">
			<slot name="footer" />
		</div>
	{/if}
</section>

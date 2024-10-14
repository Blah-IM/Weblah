<section class="my-4 px-4">
	{#if $$slots.header}
		<h3 class="mb-1 truncate text-sm font-medium uppercase text-sf-secondary">
			<slot name="header" />
		</h3>
	{/if}
	<div
		class="divide-y-[0.5px] divide-ss-secondary rounded-lg border-[0.5px] border-ss-secondary bg-sb-primary shadow-sm"
	>
		<slot />
	</div>
	{#if $$slots.footer}
		<div class="mt-1 text-sm font-medium uppercase text-sf-secondary">
			<slot name="footer" />
		</div>
	{/if}
</section>

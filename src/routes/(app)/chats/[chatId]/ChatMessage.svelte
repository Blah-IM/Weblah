<script lang="ts">
	import RichTextRenderer from '$lib/components/RichTextRenderer.svelte';
	import { tw } from '$lib/tw';
	import type { Message } from '$lib/types';
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let message: Message;
	export let isMyself: boolean;
</script>

<div class={tw('mb-2 flex items-end gap-2 px-2', isMyself && 'flex-row-reverse')}>
	<div>
		<AvatarBeam size={30} name={message.sender.name} />
	</div>
	<div class="relative flex-1">
		<div
			class="
			  relative inline-block max-w-[85%] rounded-2xl bg-sb-primary px-3 py-2 shadow-sm ring-1 ring-ss-secondary before:absolute
				before:-bottom-[2px] before:-start-5 before:z-0 before:box-content before:h-6 before:w-5 before:rounded-ee-[16px_12px] before:border-e-[10px] before:border-sb-primary before:text-ss-secondary before:drop-shadow-[-1px_0] after:absolute
				after:-bottom-[2px] after:-start-5 after:-z-10 after:box-content after:h-6 after:w-5 after:rounded-ee-[16px_12px] after:border-e-[10px] after:text-ss-secondary after:drop-shadow-[0_1px]
				sm:max-w-[70%] lg:max-w-[50%]
			"
		>
			<RichTextRenderer content={message.content} class="z-10" />
		</div>
	</div>
</div>

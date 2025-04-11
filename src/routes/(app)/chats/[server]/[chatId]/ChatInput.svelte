<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import RichTextInput from '$lib/components/RichTextInput.svelte';
	import type { BlahRichText } from '@blah-im/core/richText';
	import { proseMirrorDocToBlahRichText } from '$lib/richText';
	import type { Node } from 'prosemirror-model';
	import { messageSchema } from '$lib/components/RichTextInput/schema';
	import { Icon, PaperAirplane, PaperClip } from 'svelte-hero-icons';

	let {
		onSendMessage
	}: {
		onSendMessage: (message: BlahRichText) => void;
	} = $props();

	let form: HTMLFormElement | null = $state(null);

	let doc: Node | null = $state(null);
	let input: ReturnType<typeof RichTextInput>;

	function onKeyboardSubmit(newDoc: Node) {
		doc = newDoc;
		form?.requestSubmit();
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		if (!doc || doc.textContent.trim() === '') return;

		const brt = proseMirrorDocToBlahRichText(doc);
		onSendMessage(brt);

		const view = input.getEditorView();
		if (view) {
			const tr = view.state.tr;
			tr.delete(0, view.state.doc.content.size);
			view.dispatch(tr);
		}
	}
</script>

<form
	class="border-ss-secondary bg-sb-primary flex w-full items-end gap-2 border-t p-2 shadow-xs"
	bind:this={form}
	onsubmit={submit}
>
	<Button class="p-1.5">
		<Icon src={PaperClip} solid class="size-5" />
		<span class="sr-only">Attach</span>
	</Button>
	<RichTextInput
		bind:this={input}
		schema={messageSchema}
		placeholder="Message"
		class="max-h-40 flex-1"
		keyboardSubmitMethod="enter"
		{onKeyboardSubmit}
		onDocChange={(newDoc) => (doc = newDoc)}
	/>
	<Button class="p-1.5" variant="primary" type="submit">
		<Icon src={PaperAirplane} solid class="z-10 size-5" />
		<span class="sr-only">Send</span>
	</Button>
</form>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import RichTextInput from '$lib/components/RichTextInput.svelte';
	import type { BlahRichText } from '@blah-im/core/richText';
	import { proseMirrorDocToBlahRichText } from '$lib/richText';
	import type { Node } from 'prosemirror-model';
	import { messageSchema } from '$lib/components/RichTextInput/schema';

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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
			/>
		</svg>
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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="z-10 size-5"
		>
			<path
				d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
			/>
		</svg>
		<span class="sr-only">Send</span>
	</Button>
</form>

<script lang="ts">
	import { DOMParser, type Node } from 'prosemirror-model';
	import { createProseMirrorEditorState, type EditorStateConfiguration } from './editorState';
	import { tw } from '$lib/tw';
	import { EditorView } from 'prosemirror-view';

	export interface Props extends Omit<EditorStateConfiguration, 'initialDoc'> {
		onDocChange?: (doc: Node) => void;
		placeholder?: string;
		children?: import('svelte').Snippet;
	}

	const { onDocChange, placeholder = '', children, ...stateConfiguration }: Props = $props();

	let domEl: HTMLDivElement;
	let editorView: EditorView;

	let isEmpty = $state(!children);

	$effect(() => {
		const initialDoc = DOMParser.fromSchema(stateConfiguration.schema).parse(domEl);
		domEl.replaceChildren();
		onDocChange?.(initialDoc);

		const state = createProseMirrorEditorState({ initialDoc, ...stateConfiguration });
		editorView = new EditorView(
			{ mount: domEl },
			{
				state,
				dispatchTransaction: (tr) => {
					const newState = state.apply(tr);
					editorView.updateState(newState);
					onDocChange?.(newState.doc);

					isEmpty = newState.doc.textContent.length === 0;
				}
			}
		);

		return () => {
			editorView.destroy();
		};
	});

	export function getEditorView(): EditorView | null {
		return editorView;
	}
</script>

<div
	class={tw(
		'rich-text relative w-full outline-hidden',
		'before:absolute before:hidden before:leading-tight before:opacity-50 before:content-[attr(data-weblah-placeholder)] data-weblah-is-empty:before:block'
	)}
	bind:this={domEl}
	data-weblah-is-empty={isEmpty ? 'true' : undefined}
	data-weblah-placeholder={placeholder}
	role="textbox"
	tabindex="0"
>
	{@render children?.()}
</div>

<style>
	:global {
		@import 'prosemirror-view/style/prosemirror.css';
	}
</style>

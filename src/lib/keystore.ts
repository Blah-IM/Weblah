import { persisted } from 'svelte-persisted-store';
import type { EncodedBlahKeyPair } from '@blah-im/core/crypto';
import { derived } from 'svelte/store';

export const keyStore = persisted<EncodedBlahKeyPair[]>('weblah-keypairs', []);
export const currentKeyIndex = persisted<number>('weblah-current-key-index', 0);
export const currentKeyPair = derived(
	[keyStore, currentKeyIndex],
	([keyStore, currentKeyIndex]) => keyStore[currentKeyIndex]
);

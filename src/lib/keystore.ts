import { persisted } from 'svelte-persisted-store';
import type { EncodedBlahKeyPair } from './blah/crypto';

export const keyStore = persisted<EncodedBlahKeyPair[]>('weblah-keypairs', []);
export const currentKeyIndex = persisted<number>('weblah-current-key-index', 0);

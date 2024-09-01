import type { EncodedBlahKeyPair } from './blah/crypto';
import { localStore } from './localstore';

export const keyStore = localStore<EncodedBlahKeyPair[]>('weblah-keypairs', []);

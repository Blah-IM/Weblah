import type { BlahSignedPayload } from '@blah-im/core/crypto';

export type BlahActKeyEntry = {
	exp: number;
};
export type BlahSignedActKeyEntry = BlahSignedPayload<BlahActKeyEntry>;

export type BlahKeyBox = BlahSignedPayload<BlahSignedActKeyEntry[]>;

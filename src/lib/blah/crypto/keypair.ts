import canonicalize from 'canonicalize';
import { BlahPublicIdentity } from './publicIdentity';
import type { BlahPayloadSignee, BlahSignedPayload } from './signedPayload';
import { bufToHex } from './utils';

export type EncodedBlahKeyPair = {
	v: '0';
	id: string;
	privateKey: JsonWebKey;
};

export class BlahKeyPair {
	publicIdentity: BlahPublicIdentity;
	private privateKey: CryptoKey;

	get id() {
		return this.publicIdentity.id;
	}
	get name() {
		return this.publicIdentity.name;
	}

	private constructor(publicIdentity: BlahPublicIdentity, privateKey: CryptoKey) {
		this.publicIdentity = publicIdentity;
		this.privateKey = privateKey;
	}

	static async generate(): Promise<BlahKeyPair> {
		const { publicKey, privateKey } = await crypto.subtle.generateKey('Ed25519', true, [
			'sign',
			'verify'
		]);
		const publicIdentity = await BlahPublicIdentity.fromPublicKey(publicKey);
		return new BlahKeyPair(publicIdentity, privateKey);
	}

	static async fromEncoded(encoded: EncodedBlahKeyPair): Promise<BlahKeyPair> {
		if (encoded.v !== '0') {
			throw new Error('Unsupported version');
		}
		const publicIdentity = await BlahPublicIdentity.fromID(encoded.id);
		const privateKey = await crypto.subtle.importKey(
			'jwk',
			encoded.privateKey,
			{ name: 'Ed25519' },
			true,
			['sign']
		);

		return new BlahKeyPair(publicIdentity, privateKey);
	}

	async encode(): Promise<EncodedBlahKeyPair> {
		return {
			v: '0',
			id: this.publicIdentity.id,
			privateKey: await crypto.subtle.exportKey('jwk', this.privateKey)
		};
	}

	async signPayload<P>(payload: P, date: Date = new Date()): Promise<BlahSignedPayload<P>> {
		const nonceBuf = new Uint32Array(1);
		crypto.getRandomValues(nonceBuf);

		const timestamp = Math.floor(date.getTime() / 1000);

		const signee: BlahPayloadSignee<P> = {
			nonce: nonceBuf[0],
			payload,
			timestamp,
			user: this.id
		};
		const signeeBytes = new TextEncoder().encode(canonicalize(signee));

		const rawSig = await crypto.subtle.sign('Ed25519', this.privateKey, signeeBytes);
		return {
			sig: bufToHex(rawSig),
			signee
		};
	}
}

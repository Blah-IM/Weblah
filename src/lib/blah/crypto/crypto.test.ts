import { test, expect } from 'vitest';
import { BlahKeyPair } from '.';

let keypair: BlahKeyPair;

test('generate keypair', async () => {
	keypair = await BlahKeyPair.generate();
});

test('encode & decode keypair', async () => {
	const encoded = await keypair.encode();
	const decoded = await BlahKeyPair.fromEncoded(encoded);

	expect(decoded.id).toBe(keypair.id);
});

test('sign & verify payload', async () => {
	const payload = { foo: 'bar', baz: 123 };
	const signedPayload = await keypair.signPayload(payload);
	const verifiedPayload = await keypair.publicIdentity.verifyPayload(signedPayload);

	expect(verifiedPayload).toEqual(payload);
});

test('sign & verify payload with wrong keypair', async () => {
	const keypair2 = await BlahKeyPair.generate();
	const payload = { foo: 'bar', baz: 123 };
	const signedPayload = await keypair.signPayload(payload);
	expect(async () => {
		await keypair2.publicIdentity.verifyPayload(signedPayload);
	}).rejects.toThrowError();
});

test('sign & verify payload with wrong key order but should still work', async () => {
	const payload = { foo: 'bar', baz: 123 };
	const signedPayload = await keypair.signPayload(payload);
	const signedPayload2 = {
		sig: signedPayload.sig,
		signee: {
			payload: { baz: 123, foo: 'bar' },
			user: signedPayload.signee.user,
			nonce: signedPayload.signee.nonce,
			timestamp: signedPayload.signee.timestamp
		}
	};
	const verifiedPayload = await keypair.publicIdentity.verifyPayload(signedPayload2);
	expect(verifiedPayload).toEqual(payload);
});

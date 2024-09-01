export function bufToHex(buf: ArrayBufferLike): string {
	return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function hexToBuf(hex: string): Uint8Array {
	return new Uint8Array((hex.match(/[\da-f]{2}/gi) ?? []).map((m) => parseInt(m, 16)));
}

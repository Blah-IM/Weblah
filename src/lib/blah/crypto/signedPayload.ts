export type BlahPayloadSignee<P> = {
	nonce: number;
	payload: P;
	timestamp: number;
	user: string;
};

export type BlahSignedPayload<P> = {
	sig: string;
	signee: BlahPayloadSignee<P>;
};

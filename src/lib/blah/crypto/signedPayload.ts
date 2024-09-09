export type BlahPayloadSignee<P> = {
	nonce: number;
	payload: P;
	timestamp: number;
	user: string;
	act_key?: string;
};

export type BlahSignedPayload<P> = {
	sig: string;
	signee: BlahPayloadSignee<P>;
};

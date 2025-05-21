import { z } from 'zod';

export type BlahAuth = { typ: 'auth' };

export const blahUserUnregisteredResponseSchema = z.object({
	register_challenge: z.object({
		pow: z.object({
			nonce: z.number().int(),
			difficulty: z.number().int()
		})
	})
});

export type BlahUserUnregisteredResponse = {
	register_challenge: {
		pow: {
			nonce: number;
			difficulty: number;
		};
	};
};

export type BlahUserRegisterRequest = {
	typ: 'user_register';
	server_url: string;
	id_url: string;
	id_key: string;
	challenge: {
		pow: {
			nonce: number;
		};
	};
};

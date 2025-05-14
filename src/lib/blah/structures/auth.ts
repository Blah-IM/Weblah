import { z } from 'zod';

export type BlahAuth = { typ: 'auth' };

export type BlahUserRegisterChallenge = {
	pow: {
		nonce: number;
		difficulty: number;
	};
};

export const blahUserRegisterChallengeSchema = z.object({
	pow: z.object({
		nonce: z.number().int(),
		difficulty: z.number().int()
	})
});

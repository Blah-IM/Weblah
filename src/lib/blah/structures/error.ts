import { z } from 'zod';

export interface BlahErrorResponse {
	error: {
		code: string;
		message: string;
	};
}

export const blahErrorResponseSchema = z.object({
	error: z.object({
		code: z.string(),
		message: z.string()
	})
});

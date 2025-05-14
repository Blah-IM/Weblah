import { blahErrorResponseSchema } from '../structures/error';

export class BlahError extends Error {
	statusCode: number;
	raw: unknown;
	blahCode: string | null = null;

	constructor(statusCode: number, errRespJSON: unknown) {
		const parsed = blahErrorResponseSchema.safeParse(errRespJSON);
		if (parsed.success) {
			super(parsed.data.error.message);
		} else {
			super();
		}

		this.statusCode = statusCode;
		this.raw = errRespJSON;
		this.name = 'BlahError';
		this.blahCode = parsed.success ? parsed.data.error.code : null;
	}

	static async fromResponse(response: Response): Promise<BlahError> {
		const errRespJSON = await response.json();
		return new BlahError(response.status, errRespJSON);
	}
}

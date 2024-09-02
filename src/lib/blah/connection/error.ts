export class BlahError extends Error {
	statusCode: number;
	raw: Record<string, unknown>;

	constructor(statusCode: number, errRespJson: { message: string } & Record<string, unknown>) {
		super(errRespJson.message);
		this.statusCode = statusCode;
		this.raw = errRespJson;
		this.name = 'BlahError';
	}

	static async fromResponse(response: Response): Promise<BlahError> {
		const errRespJson = await response.json();
		return new BlahError(response.status, errRespJson);
	}
}

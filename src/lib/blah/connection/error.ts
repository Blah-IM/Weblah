export class BlahError extends Error {
	raw: Record<string, unknown>;

	constructor(errRespJson: { message: string } & Record<string, unknown>) {
		super(errRespJson.message);
		this.raw = errRespJson;
		this.name = 'BlahError';
	}

	static async fromResponse(response: Response): Promise<BlahError> {
		const errRespJson = await response.json();
		return new BlahError(errRespJson);
	}
}

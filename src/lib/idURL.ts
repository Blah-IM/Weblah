import { BlahIdentity, blahIdentityDescriptionSchema } from '@blah-im/core/identity';

export function idURLToUsername(idURL: string): string {
	const url = new URL(idURL);
	return url.host;
}

export const identityDescriptionFilePath = '/.well-known/blah/identity.json';

export type IDURLValidity =
	| { valid: true }
	| ({ valid: false } & (
			| {
					reason:
						| 'invalid-url'
						| 'profile-invalid'
						| 'identity-mismatch'
						| 'identity-missing-idurl';
			  }
			| {
					reason: 'identity-request-failed';
					status?: number;
					errorText?: string;
			  }
	  ));
export async function validateIDURL(url: string, identity: BlahIdentity): Promise<IDURLValidity> {
	const idURL = URL.parse(url);
	if (
		!idURL ||
		idURL.protocol !== 'https:' ||
		idURL.pathname !== '/' ||
		idURL.search ||
		idURL.username ||
		idURL.password
	)
		return { valid: false, reason: 'invalid-url' };

	const profileFileURL = (() => {
		let url = idURL;
		url.pathname = identityDescriptionFilePath;
		return url.toString();
	})();

	try {
		const response = await fetch(profileFileURL, {
			method: 'GET',
			headers: { Accept: 'application/json' }
		});
		if (!response.ok || response.status !== 200) {
			return {
				valid: false,
				reason: 'identity-request-failed',
				status: response.status,
				errorText: await response.text()
			};
		}

		const identityDescription = await response.json();
		const { data: parsedIdentityDescription } =
			blahIdentityDescriptionSchema.safeParse(identityDescription);
		if (!parsedIdentityDescription) return { valid: false, reason: 'profile-invalid' };

		if (parsedIdentityDescription.id_key !== identity.idPublicKey.id)
			return { valid: false, reason: 'identity-mismatch' };

		if (parsedIdentityDescription.profile.signee.payload.id_urls.findIndex((x) => x === url) === -1)
			return { valid: false, reason: 'identity-missing-idurl' };

		const identityFromDescription =
			await BlahIdentity.fromIdentityDescription(parsedIdentityDescription);
		if (!identityFromDescription.profileSigValid)
			return { valid: false, reason: 'profile-invalid' };

		return { valid: true };
	} catch (e) {
		return {
			valid: false,
			reason: 'identity-request-failed',
			errorText: (e as Error).message
		};
	}
}

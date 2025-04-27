import { type AccountKeyDB, openAccountKeyDB } from './accountKeyDB';
import {
	BlahIdentity,
	type BlahIdentityDescription,
	type BlahProfile
} from '@blah-im/core/identity';
import { type IdentityDB, openIdentityDB } from './identityDB';
import { BlahKeyPair } from '@blah-im/core/crypto';
import { browser } from '$app/environment';

export type Account = BlahIdentityDescription & {
	holdingIdPrivate: boolean;
	holdingPrivateOfActKeyId?: string;
};

const localStorageCurrentAccountIdKey = 'weblah-current-account-id-key';

class AccountManager {
	private keyDB: AccountKeyDB | undefined;
	private identityDB: IdentityDB | undefined;

	accounts: Account[] = $state([]);
	inProgress: boolean = $state(true);
	currentAccountId: string | null = $state(null);
	currentAccount: Account | null = $derived(
		this.accounts.find((account) => account.id_key === this.currentAccountId) ?? null
	);

	constructor() {
		if (browser) {
			this.currentAccountId = localStorage.getItem(localStorageCurrentAccountIdKey);
			console.log('currentAccountId', this.currentAccountId);

			$effect.root(() => {
				$effect(() =>
					this.currentAccountId
						? localStorage.setItem(localStorageCurrentAccountIdKey, this.currentAccountId)
						: localStorage.removeItem(localStorageCurrentAccountIdKey)
				);
			});

			(async () => {
				this.inProgress = true;
				const [keyDB, identityDB] = await Promise.all([openAccountKeyDB(), openIdentityDB()]);
				this.keyDB = keyDB;
				this.identityDB = identityDB;
				await this.loadAccounts();
				this.inProgress = false;
			})();
		}
	}

	async loadAccounts() {
		if (!this.keyDB || !this.identityDB) throw new Error('Account manager not initialized');

		this.inProgress = true;
		const accountCreds = await this.keyDB.fetchAllAccounts();
		const identityFileMap = await this.identityDB.fetchIdentities(
			accountCreds.map((x) => x.idKeyId)
		);

		const accounts: Account[] = accountCreds.flatMap((creds) => {
			const identityFile = identityFileMap.get(creds.idKeyId);
			if (!identityFile) return [];
			return [
				{
					...identityFile,
					holdingIdPrivate: !!creds.encodedIdKeyPair,
					holdingPrivateOfActKey: creds.actKeyPair.id
				}
			];
		});

		this.accounts = accounts;
		this.inProgress = false;
	}

	async identityForAccount(
		accountOrIdKeyId: Account | string,
		password?: string
	): Promise<BlahIdentity> {
		if (!this.keyDB || !this.identityDB) throw new Error('Account manager not initialized');

		const idKeyId =
			typeof accountOrIdKeyId === 'string' ? accountOrIdKeyId : accountOrIdKeyId.id_key;

		const identityFile = await this.identityDB.fetchIdentity(idKeyId);
		if (!identityFile) throw new Error('Identity file not found');

		const accountCreds = await this.keyDB.fetchAccount(idKeyId);
		const encodedIdKeyPair = accountCreds?.encodedIdKeyPair;
		const idKeyPair =
			encodedIdKeyPair && password
				? await BlahKeyPair.fromEncoded(encodedIdKeyPair, password)
				: undefined;
		const actKeyPair = accountCreds?.actKeyPair;

		return await BlahIdentity.fromIdentityDescription(identityFile, idKeyPair, actKeyPair);
	}

	async saveIdentity(identity: BlahIdentity) {
		if (!this.identityDB) throw new Error('Account manager not initialized');

		const identityDesc = identity.generateIdentityDescription();
		await this.identityDB.updateIdentity(identityDesc);
		await this.loadAccounts();
	}

	async changePassword(
		accountOrIdKeyId: Account | string,
		oldPassword: string,
		newPassword: string
	) {
		if (!this.keyDB) throw new Error('Account manager not initialized');

		const idKeyId =
			typeof accountOrIdKeyId === 'string' ? accountOrIdKeyId : accountOrIdKeyId.id_key;
		const accountCreds = await this.keyDB.fetchAccount(idKeyId);
		const encodedIdKeyPair = accountCreds?.encodedIdKeyPair;
		if (!encodedIdKeyPair) throw new Error('No encoded ID key pair found');

		const idKeyPair = await BlahKeyPair.fromEncoded(encodedIdKeyPair, oldPassword);
		const newEncodedIdKeyPair = await idKeyPair.encode(newPassword);
		await this.keyDB.updateEncodedIdKeyPair(idKeyId, newEncodedIdKeyPair);
	}

	async createAccount(profile: BlahProfile, password: string): Promise<string> {
		if (!this.keyDB) throw new Error('Account manager not initialized');

		const idKeyPair = await BlahKeyPair.generate(true);
		const actKeyPair = await BlahKeyPair.generate(false);
		const identity = await BlahIdentity.create(idKeyPair, actKeyPair, profile);
		const encodedIdKeyPair = await idKeyPair.encode(password);
		await this.keyDB.addAccount(idKeyPair.id, actKeyPair, encodedIdKeyPair);
		await this.saveIdentity(identity);
		return idKeyPair.id;
	}
}

export default new AccountManager();

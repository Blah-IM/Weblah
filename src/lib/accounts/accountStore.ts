import { writable, type Readable } from 'svelte/store';
import { type AccountKeyDB, openAccountKeyDB } from './accountKeyDB';
import {
	BlahIdentity,
	type BlahIdentityDescription,
	type BlahProfile
} from '@blah-im/core/identity';
import { type IdentityDB, openIdentityDB } from './identityFileDB';
import { BlahKeyPair } from '@blah-im/core/crypto';
import { persisted } from 'svelte-persisted-store';

export type Account = BlahIdentityDescription & {
	holdingKeyPrivate: boolean;
	holdingPrivateOfActKey?: string;
};

class AccountStore implements Readable<Account[]> {
	private keyDB: AccountKeyDB;
	private identityDB: IdentityDB;
	private internalStore = writable<Account[]>([]);
	subscribe = this.internalStore.subscribe;

	private constructor(keyDB: AccountKeyDB, identityDB: IdentityDB) {
		this.keyDB = keyDB;
		this.identityDB = identityDB;
	}

	static async open(): Promise<AccountStore> {
		const keyDB = await openAccountKeyDB();
		const identityFileDB = await openIdentityDB();
		const store = new AccountStore(keyDB, identityFileDB);
		await store.loadAccounts();
		return store;
	}

	async loadAccounts() {
		const accountCreds = await this.keyDB.fetchAllAccounts();
		const identityFileMap = await this.identityDB.fetchIdentities(
			accountCreds.map((x) => x.idKeyId)
		);

		const accounts = accountCreds.flatMap((creds) => {
			const identityFile = identityFileMap.get(creds.idKeyId);
			if (!identityFile) return [];
			return [
				{
					...identityFile,
					holdingKeyPrivate: !!creds.encodedIdKeyPair,
					holdingPrivateOfActKey: creds.actKeyPair.id
				}
			];
		});

		this.internalStore.set(accounts);
	}

	async identityForAccount(
		accountOrIdKeyId: Account | string,
		password?: string
	): Promise<BlahIdentity> {
		const idKeyId =
			typeof accountOrIdKeyId === 'string' ? accountOrIdKeyId : accountOrIdKeyId.id_key;

		const identityFile = await this.identityDB.fetchIdentity(idKeyId);
		if (!identityFile) throw new Error('Identity file not found');

		const accountCreds = await this.keyDB.fetchAccount(idKeyId);
		const encodedIdKeyPair = accountCreds?.encodedIdKeyPair;
		const idKeyPair = encodedIdKeyPair
			? await BlahKeyPair.fromEncoded(encodedIdKeyPair, password)
			: undefined;
		const actKeyPair = accountCreds?.actKeyPair;

		return await BlahIdentity.fromIdentityDescription(identityFile, idKeyPair, actKeyPair);
	}

	async saveIdentityDescription(identity: BlahIdentity) {
		const identityDesc = identity.generateIdentityDescription();
		await this.identityDB.updateIdentity(identityDesc);
	}

	async createAccount(profile: BlahProfile, password: string): Promise<string> {
		const idKeyPair = await BlahKeyPair.generate(true);
		const actKeyPair = await BlahKeyPair.generate(false);
		const identity = await BlahIdentity.create(idKeyPair, actKeyPair, profile);
		const encodedIdKeyPair = await idKeyPair.encode(password);
		await this.keyDB.addAccount(idKeyPair.id, actKeyPair, encodedIdKeyPair);
		await this.saveIdentityDescription(identity);
		await this.loadAccounts();
		return idKeyPair.id;
	}
}

let accountStore: AccountStore | undefined;

export async function openAccountStore(): Promise<AccountStore> {
	if (!accountStore) {
		accountStore = await AccountStore.open();
	}
	return accountStore;
}

export type { AccountStore };

export const currentAccountStore = persisted<string | null>('weblah-current-account-id-key', null);

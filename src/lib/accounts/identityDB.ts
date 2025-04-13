import type { BlahIdentityDescription } from '@blah-im/core/identity';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const IDB_NAME = 'weblah-identities';
const IDB_OBJECT_STORE_NAME = 'identities';

const IDENTITY_FILE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

interface IdentityDBSchema extends DBSchema {
	[IDB_OBJECT_STORE_NAME]: {
		key: string;
		value: BlahIdentityDescription & { lastUpdatedAt: Date };
		indexes: { id_urls: string };
	};
}

class IdentityDB {
	private db: IDBPDatabase<IdentityDBSchema>;

	private constructor(db: IDBPDatabase<IdentityDBSchema>) {
		this.db = db;
	}

	static async open(): Promise<IdentityDB> {
		const db = await openDB<IdentityDBSchema>(IDB_NAME, 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(IDB_OBJECT_STORE_NAME)) {
					const store = db.createObjectStore(IDB_OBJECT_STORE_NAME, { keyPath: 'id_key' });
					store.createIndex('id_urls', 'profile.signee.payload.id_urls', {
						multiEntry: true,
						unique: true
					});
				}
			}
		});

		const store = new IdentityDB(db);
		await store.removeExpiredIdentities();
		return store;
	}

	async updateIdentity(identityDescription: BlahIdentityDescription): Promise<void> {
		await this.db.put(IDB_OBJECT_STORE_NAME, { ...identityDescription, lastUpdatedAt: new Date() });
	}

	async fetchIdentity(idKeyId: string): Promise<BlahIdentityDescription | undefined> {
		return await this.db.get(IDB_OBJECT_STORE_NAME, idKeyId);
	}

	async fetchIdentities(idKeyIds: string[]): Promise<Map<string, BlahIdentityDescription>> {
		return new Map(
			(
				await Promise.all(
					idKeyIds.map(async (idKeyId): Promise<[string, BlahIdentityDescription] | null> => {
						const profile = await this.fetchIdentity(idKeyId);
						return profile ? [idKeyId, profile] : null;
					})
				)
			).filter((x): x is [string, BlahIdentityDescription] => !!x)
		);
	}

	async getIdentityByIdUrl(idUrl: string): Promise<BlahIdentityDescription | undefined> {
		return await this.db.getFromIndex(IDB_OBJECT_STORE_NAME, 'id_urls', idUrl);
	}

	async removeExpiredIdentities(): Promise<void> {
		const now = new Date();
		const cutoff = new Date(now.getTime() - IDENTITY_FILE_MAX_AGE);
		await this.db.delete(IDB_OBJECT_STORE_NAME, IDBKeyRange.upperBound(cutoff));
	}
}

let identityFileDB: IdentityDB | null = null;
export async function openIdentityDB(): Promise<IdentityDB> {
	if (!identityFileDB) {
		identityFileDB = await IdentityDB.open();
	}
	return identityFileDB;
}
export type { IdentityDB };

import type { BlahIdentityFile } from '@blah-im/core/identity';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const IDB_NAME = 'weblah-identities';
const IDB_OBJECT_STORE_NAME = 'identities';

const IDENTITY_FILE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

interface IdentityFileDBSchema extends DBSchema {
	[IDB_OBJECT_STORE_NAME]: {
		key: string;
		value: BlahIdentityFile & { lastUpdatedAt: Date };
		indexes: { id_urls: string };
	};
}

class IdentityFileDB {
	private db: IDBPDatabase<IdentityFileDBSchema>;

	private constructor(db: IDBPDatabase<IdentityFileDBSchema>) {
		this.db = db;
	}

	static async open(): Promise<IdentityFileDB> {
		const db = await openDB<IdentityFileDBSchema>(IDB_NAME, 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(IDB_OBJECT_STORE_NAME)) {
					const store = db.createObjectStore(IDB_OBJECT_STORE_NAME, { keyPath: 'idKeyId' });
					store.createIndex('id_urls', 'profile.signee.payload.id_urls', {
						multiEntry: true,
						unique: true
					});
				}
			}
		});

		const store = new IdentityFileDB(db);
		await store.removeExpiredIdentityFiles();
		return store;
	}

	async updateIdentityFile(identityFile: BlahIdentityFile): Promise<void> {
		await this.db.put(IDB_OBJECT_STORE_NAME, { ...identityFile, lastUpdatedAt: new Date() });
	}

	async fetchIdentityFile(idKeyId: string): Promise<BlahIdentityFile | undefined> {
		return await this.db.get(IDB_OBJECT_STORE_NAME, idKeyId);
	}

	async fetchIdentityFiles(idKeyIds: string[]): Promise<Map<string, BlahIdentityFile>> {
		return new Map(
			(
				await Promise.all(
					idKeyIds.map(async (idKeyId): Promise<[string, BlahIdentityFile] | null> => {
						const profile = await this.fetchIdentityFile(idKeyId);
						return profile ? [idKeyId, profile] : null;
					})
				)
			).filter((x): x is [string, BlahIdentityFile] => !!x)
		);
	}

	async getIdentityFileByIdUrl(idUrl: string): Promise<BlahIdentityFile | undefined> {
		return await this.db.getFromIndex(IDB_OBJECT_STORE_NAME, 'id_urls', idUrl);
	}

	async removeExpiredIdentityFiles(): Promise<void> {
		const now = new Date();
		const cutoff = new Date(now.getTime() - IDENTITY_FILE_MAX_AGE);
		await this.db.delete(IDB_OBJECT_STORE_NAME, IDBKeyRange.upperBound(cutoff));
	}
}

let identityFileDB: IdentityFileDB | null = null;
export async function openIdentityFileDB(): Promise<IdentityFileDB> {
	if (!identityFileDB) {
		identityFileDB = await IdentityFileDB.open();
	}
	return identityFileDB;
}
export type { IdentityFileDB };

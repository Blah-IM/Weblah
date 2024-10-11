import type { BlahProfile } from '@blah-im/core/identity';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const IDB_NAME = 'weblah-profiles';
const IDB_OBJECT_STORE_NAME = 'profiles';

const PROFILE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

interface ProfileStoreDB extends DBSchema {
	[IDB_OBJECT_STORE_NAME]: {
		key: string;
		value: BlahProfile & { idKeyId: string; lastUpdatedAt: Date };
		indexes: { id_urls: string };
	};
}

export class ProfileStore {
	private db: IDBPDatabase<ProfileStoreDB>;

	private constructor(db: IDBPDatabase<ProfileStoreDB>) {
		this.db = db;
	}

	static async open(): Promise<ProfileStore> {
		const db = await openDB<ProfileStoreDB>(IDB_NAME, 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(IDB_OBJECT_STORE_NAME)) {
					const store = db.createObjectStore(IDB_OBJECT_STORE_NAME, { keyPath: 'idKeyId' });
					store.createIndex('id_urls', 'id_urls', { multiEntry: true, unique: true });
				}
			}
		});

		const store = new ProfileStore(db);
		await store.removeOldProfiles();
		return store;
	}

	async updateProfile(idKeyId: string, profile: BlahProfile): Promise<void> {
		await this.db.put(IDB_OBJECT_STORE_NAME, { idKeyId, ...profile, lastUpdatedAt: new Date() });
	}

	async getProfile(idKeyId: string): Promise<BlahProfile | undefined> {
		return await this.db.get(IDB_OBJECT_STORE_NAME, idKeyId);
	}

	async getProfileByIdUrl(idUrl: string): Promise<BlahProfile | undefined> {
		return await this.db.getFromIndex(IDB_OBJECT_STORE_NAME, 'id_urls', idUrl);
	}

	async removeOldProfiles(): Promise<void> {
		const now = new Date();
		const cutoff = new Date(now.getTime() - PROFILE_MAX_AGE);
		await this.db.delete(IDB_OBJECT_STORE_NAME, IDBKeyRange.upperBound(cutoff));
	}
}

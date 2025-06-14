import { BlahKeyPair, BlahPublicKey, type EncodedBlahKeyPair } from '@blah-im/core/crypto';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const IDB_NAME = 'weblah-accounts';
const IDB_OBJECT_STORE_NAME = 'accounts';

type SavedObject = {
	idKeyId: string;
	encodedIdKeyPair?: EncodedBlahKeyPair;
	actKeyId: string;
	actKeyPrivate: CryptoKey;
	chatServers: string[];
};

export type AccountCredentials = {
	idKeyId: string;
	encodedIdKeyPair?: EncodedBlahKeyPair;
	actKeyPair: BlahKeyPair;
	chatServers: string[];
};

interface AccountKeyDBSchema extends DBSchema {
	[IDB_OBJECT_STORE_NAME]: {
		key: string;
		value: SavedObject;
		indexes: { actKeyId: string };
	};
}

async function savedObjectToAccountCredentials(
	savedObject: SavedObject
): Promise<AccountCredentials> {
	const publicKey = await BlahPublicKey.fromID(savedObject.actKeyId);
	return {
		idKeyId: savedObject.idKeyId,
		encodedIdKeyPair: savedObject.encodedIdKeyPair,
		actKeyPair: new BlahKeyPair(publicKey, savedObject.actKeyPrivate),
		chatServers: savedObject.chatServers
	};
}

class AccountKeyDB {
	private db: IDBPDatabase<AccountKeyDBSchema>;

	private constructor(db: IDBPDatabase<AccountKeyDBSchema>) {
		this.db = db;
	}

	static async open(): Promise<AccountKeyDB> {
		const db = await openDB<AccountKeyDBSchema>(IDB_NAME, 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(IDB_OBJECT_STORE_NAME)) {
					const objStore = db.createObjectStore(IDB_OBJECT_STORE_NAME, { keyPath: 'idKeyId' });
					objStore.createIndex('actKeyId', 'actKeyId');
				}
			}
		});

		return new AccountKeyDB(db);
	}

	async addAccount(
		idKeyId: string,
		actKeyPair: BlahKeyPair,
		encodedIdKeyPair?: EncodedBlahKeyPair,
		chatServers: string[] = []
	): Promise<AccountCredentials> {
		const newObject: SavedObject = {
			idKeyId,
			encodedIdKeyPair,
			actKeyId: actKeyPair.id,
			actKeyPrivate: actKeyPair.privateKey,
			chatServers
		};

		const tx = this.db.transaction(IDB_OBJECT_STORE_NAME, 'readwrite');
		const currentObject = await tx.store.get(idKeyId);
		await tx.store.put({ ...currentObject, ...newObject });
		await tx.done;

		return { idKeyId, encodedIdKeyPair, actKeyPair, chatServers };
	}

	async updateEncodedIdKeyPair(
		idKeyId: string,
		encodedIdKeyPair: EncodedBlahKeyPair
	): Promise<void> {
		const tx = this.db.transaction(IDB_OBJECT_STORE_NAME, 'readwrite');
		const currentObject = await tx.store.get(idKeyId);
		if (!currentObject) {
			await tx.done;
			return;
		}
		currentObject.encodedIdKeyPair = encodedIdKeyPair;
		await tx.store.put(currentObject);
		await tx.done;
	}

	async remove(idKeyId: string): Promise<void> {
		await this.db.delete(IDB_OBJECT_STORE_NAME, idKeyId);
	}

	async removeIDKeyPrivateOnly(idKeyId: string): Promise<void> {
		const tx = this.db.transaction(IDB_OBJECT_STORE_NAME, 'readwrite');
		const currentObject = await tx.store.get(idKeyId);
		if (!currentObject) {
			await tx.done;
			return;
		}
		delete currentObject.encodedIdKeyPair;
		await tx.store.put(currentObject);
		await tx.done;
	}

	async fetchAccount(idKeyId: string): Promise<AccountCredentials | null> {
		const result = await this.db.get(IDB_OBJECT_STORE_NAME, idKeyId);
		if (!result) return null;
		return await savedObjectToAccountCredentials(result);
	}

	async fetchAllAccounts(): Promise<AccountCredentials[]> {
		const list: AccountCredentials[] = [];

		const transaction = this.db.transaction(IDB_OBJECT_STORE_NAME, 'readonly');
		let cursor = await transaction.store.openCursor();
		while (cursor) {
			list.push(await savedObjectToAccountCredentials(cursor.value));
			cursor = await cursor.continue();
		}

		return list;
	}

	close() {
		this.db.close();
	}
}

let accountKeyDB: AccountKeyDB | null = null;
export async function openAccountKeyDB(): Promise<AccountKeyDB> {
	if (!accountKeyDB) {
		accountKeyDB = await AccountKeyDB.open();
	}

	return accountKeyDB;
}
export type { AccountKeyDB };

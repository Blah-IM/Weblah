// Loosely based on https://github.com/infotechinc/key-storage-in-browser/blob/master/keystore.js

import { BlahKeyPair, BlahPublicKey } from '@blah-im/core/crypto';

type SavedObject = {
	idKeyId: string;
	actKeyId: string;
	privateKey: CryptoKey;
};

type QueryResult = {
	idKeyId: string;
	keypair: BlahKeyPair;
};

async function savedObjectToQueryResult(savedObject: SavedObject): Promise<QueryResult> {
	const publicKey = await BlahPublicKey.fromID(savedObject.actKeyId);
	return {
		idKeyId: savedObject.idKeyId,
		keypair: new BlahKeyPair(publicKey, savedObject.privateKey)
	};
}

export class ActKeyStore {
	private db: IDBDatabase | null = null;
	private dbName: string = 'WeblahActKeyStore';
	private objectStoreName: string = 'keys';

	async open(): Promise<ActKeyStore> {
		if (!window.indexedDB) throw new Error('IndexedDB is not supported.');

		const req = indexedDB.open(this.dbName, 1);

		return new Promise<ActKeyStore>((fulfill, reject) => {
			req.onsuccess = () => {
				this.db = req.result;
				fulfill(this);
			};
			req.onerror = () => reject(req.error);
			req.onblocked = () => reject(new Error('Database already open'));
			req.onupgradeneeded = () => {
				this.db = req.result;
				if (!this.db.objectStoreNames.contains(this.objectStoreName)) {
					const objStore = this.db.createObjectStore(this.objectStoreName);
					objStore.createIndex('idKeyId', 'idKeyId', { unique: false });
					objStore.createIndex('actKeyId', 'actKeyId', { unique: true });
				}
			};
		});
	}

	async saveActKeyPair(keypair: BlahKeyPair, idKeyId: string): Promise<QueryResult> {
		if (!this.db) throw new Error('ActKeyStore is not open.');

		const savedObject: SavedObject = {
			idKeyId,
			actKeyId: keypair.id,
			privateKey: keypair.privateKey
		};

		const transaction = this.db.transaction(this.objectStoreName, 'readwrite');

		return await new Promise((fulfill, reject) => {
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);
			transaction.oncomplete = () => fulfill({ idKeyId, keypair });
			const objectStore = transaction.objectStore(this.objectStoreName);
			objectStore.add(savedObject);
		});
	}

	async fetchActKeyPair(actKeyId: string): Promise<QueryResult | null> {
		if (!this.db) throw new Error('ActKeyStore is not open.');

		const transaction = this.db.transaction(this.objectStoreName, 'readonly');
		const objectStore = transaction.objectStore(this.objectStoreName);

		const request: IDBRequest<SavedObject> = objectStore.index('actKeyId').get(actKeyId);

		const result = await new Promise<SavedObject | null>((fulfill, reject) => {
			request.onsuccess = () => fulfill(request.result);
			request.onerror = () => reject(request.error);
		});

		if (!result) return null;
		return await savedObjectToQueryResult(result);
	}

	async fetchAllKeyPairs(): Promise<QueryResult[]> {
		if (!this.db) throw new Error('ActKeyStore is not open.');

		const list: QueryResult[] = [];

		const transaction = this.db.transaction([this.objectStoreName], 'readonly');

		return new Promise((fulfill, reject) => {
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);

			const objectStore = transaction.objectStore(this.objectStoreName);
			const cursor = objectStore.openCursor();

			cursor.onsuccess = async () => {
				const result = cursor.result;
				if (result) {
					list.push(await savedObjectToQueryResult(result.value));
					result.continue();
				} else {
					fulfill(list);
				}
			};
		});
	}

	close() {
		this.db?.close();
		this.db = null;
	}
}

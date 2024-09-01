import { browser } from '$app/environment';
import { get, writable, type Writable } from 'svelte/store';

export function localStore<V>(key: string, initialData: V): Writable<V> {
	const store = writable(initialData);
	const { subscribe, set } = store;

	if (browser) {
		const storedValue = localStorage.getItem(key);
		if (storedValue) set(JSON.parse(storedValue));
	}

	return {
		subscribe,
		set: (v) => {
			if (browser) {
				localStorage.setItem(key, JSON.stringify(v));
			}
			set(v);
		},
		update: (cb) => {
			const updatedStore = cb(get(store));

			if (browser) localStorage.setItem(key, JSON.stringify(updatedStore));
			set(updatedStore);
		}
	};
}

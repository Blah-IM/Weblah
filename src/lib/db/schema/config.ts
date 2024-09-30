import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const configs = sqliteTable('weblah-config', {
	key: text('key').primaryKey(),
	value: text('value')
});

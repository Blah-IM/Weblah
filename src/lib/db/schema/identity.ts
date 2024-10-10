import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const identities = sqliteTable('weblah-identities', {
	idKey: text('id_key').primaryKey(),
	actKeys: text('act_keys').notNull(),
	profileName: text('profile_name').notNull(),
	profileBio: text('profile_bio'),
	preferredChatServerUrls: text('preferred_chat_server_urls').notNull(),
	idUrls: text('id_urls').notNull()
});

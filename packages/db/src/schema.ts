import { type InferModel } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const authedUsers = pgTable('authed_users', {
    twitchId: varchar('twitch_id', { length: 256 }).primaryKey(),
    twitchLogin: varchar('twitch_login', { length: 256 }).notNull(),
    scopes: varchar('scopes', { length: 256 }).array().notNull(),
    accessToken: varchar('access_token', { length: 256 }).notNull(),
    refreshToken: varchar('refresh_token', { length: 256 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    obtainedAt: timestamp('obtained_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type AuthedUser = InferModel<typeof authedUsers>;
export type NewAuthedUser = InferModel<typeof authedUsers, 'insert'>;
export type UpdateAuthedUser = Partial<AuthedUser>;

export const states = pgTable('auth_states', {
    state: varchar('state', { length: 64 }).primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type State = InferModel<typeof states>;
export type NewState = InferModel<typeof states, 'insert'>;

export const channels = pgTable('channels', {
    twitchId: varchar('twitch_id', { length: 256 }).primaryKey(),
    twitchLogin: varchar('twitch_login', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    mode: varchar('mode', { length: 256, enum: ['readonly', 'all', 'offlineonly'] }).notNull(),
});

export type Channel = InferModel<typeof channels>;
export type NewChannel = InferModel<typeof channels, 'insert'>;
export type UpdateChannel = Partial<Channel>;
export type ChannelMode = Channel['mode'];

// export const ambassadors = pgTable('ambassadors', {
// twitchId: varchar('twitch_id', { length: 256 }).primaryKey(),
// twitchLogin: varchar('twitch_login', { length: 256 }).notNull(),
// createdAt: timestamp('created_at').notNull().defaultNow(),
// channelId: varchar('channel_id', { length: 256 })
// .notNull()
// .references(() => channels.twitchId, { onDelete: 'cascade' }),
// });

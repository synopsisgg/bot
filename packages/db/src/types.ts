import { type DrizzleConfig } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type Options, type Sql } from 'postgres';

import { type EditHelpers } from './helpers/edit';
import { type FindHelpers } from './helpers/find';
import { type DatabaseSchema } from './schema';

export type DatabaseWithoutHelpers = PostgresJsDatabase<DatabaseSchema>;
export type Database = DatabaseWithoutHelpers & { find: FindHelpers; edit: EditHelpers };
export type DatabaseOptions = Omit<DrizzleConfig, 'schema'> & Options<NonNullable<unknown>>;
export type DatabaseClient = Sql;

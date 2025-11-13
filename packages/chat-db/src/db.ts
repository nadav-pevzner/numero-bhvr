import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function createChatDb(connectionString: string) {
	const pool = new Pool({ connectionString });
	const db = drizzle({ client: pool });

	return db;
}

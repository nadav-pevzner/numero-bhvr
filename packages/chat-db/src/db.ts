import { drizzle as nodePgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";

export function createChatDb(connectionString: string) {
	// Use node-postgres for development, Neon HTTP for production
	if (process.env.NODE_ENV === "production") {
		const sql = neon(connectionString);
		const db = neonDrizzle(sql, { schema });
		return db;
	}

	// Development: use node-postgres
	const pool = new Pool({ connectionString });
	const db = nodePgDrizzle({ client: pool, schema });
	return db;
}

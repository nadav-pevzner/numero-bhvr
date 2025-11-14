import { drizzle as nodePgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

export function createAuthDb(connectionString: string) {
	// Use node-postgres for development, Neon HTTP for production
	if (process.env.NODE_ENV === "production") {
		const sql = neon(connectionString);
		const db = neonDrizzle(sql);
		return db;
	}

	// Development: use node-postgres
	const pool = new Pool({ connectionString });
	const db = nodePgDrizzle({ client: pool });
	return db;
}

import { desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { todos } from "./schema";

type DbClient = NodePgDatabase<Record<string, never>> | NeonHttpDatabase<Record<string, never>>;

export function createAuthQueries(db: DbClient) {
	return {
		getTodosByUserId: async (userId: string) => {
			return db
				.select()
				.from(todos)
				.where(eq(todos.userId, userId))
				.orderBy(desc(todos.createdAt));
		},
	};
}

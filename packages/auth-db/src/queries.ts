import { desc, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { todos } from "./schema";

export function createAuthQueries(
	db: NodePgDatabase<Record<string, never>> & {
		$client: Pool;
	},
) {
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

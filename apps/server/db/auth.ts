import { createAuthDb, createAuthQueries } from "@numero/auth-db";
import { env } from "@numero/env";
export const authDb = createAuthDb(env.AUTH_DB_URL);
export const authQueries = createAuthQueries(authDb);

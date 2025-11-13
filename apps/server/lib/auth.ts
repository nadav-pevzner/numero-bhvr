import { createAuthDb, schema } from "@numero/auth-db";
import { env } from "@numero/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

const db = createAuthDb(env.AUTH_DB_URL);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.CLIENT_URL],
  plugins: [openAPI()],
});

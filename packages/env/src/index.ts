import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Database URLs
		AUTH_DB_URL: z.url(),
		CHAT_DB_URL: z.url(),

		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
		PORT: z.string().default("3000"),

		CLIENT_URL: z.string().min(1),
	},


	runtimeEnv: process.env,

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,


	emptyStringAsUndefined: true,
});

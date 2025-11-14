import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database URLs
    AUTH_DB_URL: z.url(),
    CHAT_DB_URL: z.url(),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    CLIENT_URL: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),

    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  },

  runtimeEnv: process.env,

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  emptyStringAsUndefined: true,
});

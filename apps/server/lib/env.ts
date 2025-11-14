import type { Env } from "@numero/env";

/**
 * Get environment variables from either process.env (Node) or Cloudflare bindings (Workers)
 */
export function getEnv(bindings?: Env): Env {
  // In Cloudflare Workers, use bindings
  if (bindings) {
    return bindings;
  }

  // In Node.js, use process.env
  if (typeof process !== "undefined" && process.env) {
    return {
      AUTH_DB_URL: process.env.AUTH_DB_URL!,
      CHAT_DB_URL: process.env.CHAT_DB_URL!,
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
      CLIENT_URL: process.env.CLIENT_URL!,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    };
  }

  throw new Error("Environment variables not available");
}

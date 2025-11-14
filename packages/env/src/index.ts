// Simple environment variable accessor that works in both Node.js and Cloudflare Workers
export const env =
  typeof process !== "undefined" && process.env
    ? (process.env as Record<string, string>)
    : ({} as Record<string, string>);

// Type-safe environment variable access
export type Env = {
  AUTH_DB_URL: string;
  CHAT_DB_URL: string;
  NODE_ENV: "development" | "production" | "test";
  CLIENT_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

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

// Lazy environment variable accessor that works in both Node.js and Cloudflare Workers
// Using a Proxy to read process.env at access time, not at module initialization
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    if (typeof process !== "undefined" && process.env) {
      return process.env[prop];
    }
    return undefined;
  },
});

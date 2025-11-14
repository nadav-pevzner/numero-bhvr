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

export const env: Env;

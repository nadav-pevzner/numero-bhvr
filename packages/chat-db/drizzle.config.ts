import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.CHAT_DB_URL!,
  },
});

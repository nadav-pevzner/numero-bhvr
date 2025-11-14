import { env } from "@numero/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import { chats } from "./routes/chats.routes";
import { todos } from "./routes/todo.routes";

const app = new Hono().basePath("/api");

// Log CORS configuration for debugging
console.log("CORS configured with CLIENT_URL:", env.CLIENT_URL);

// IMPORTANT: CORS middleware must be registered BEFORE routes
app.use(
  "*", // Enable CORS for all routes
  cors({
    origin: env.CLIENT_URL || "*",
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH", "PUT"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  }),
);

const router = app
  .on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))
  .route("/todos", todos)
  .route("/chats", chats);

export type AppType = typeof router;
export default app;

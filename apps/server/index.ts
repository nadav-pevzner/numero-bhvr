import { env } from "@numero/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import { chats } from "./routes/chats.routes";
import { todos } from "./routes/todo.routes";

const app = new Hono().basePath("/api");

// Health check at root
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Numero BHVR Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/**",
      chats: "/api/chats",
      todos: "/api/todos"
    }
  });
});

// Log CORS configuration for debugging
console.log("CORS configured with CLIENT_URL:", env.CLIENT_URL);

// IMPORTANT: CORS middleware must be registered BEFORE routes
app.use(
  "*", // Enable CORS for all routes
  cors({
    origin: (origin) => {
      // Allow the configured client URL
      if (env.CLIENT_URL && origin === env.CLIENT_URL) {
        return env.CLIENT_URL;
      }
      // Allow Vercel preview deployments
      if (origin?.includes('.vercel.app')) {
        return origin;
      }
      // Allow localhost for development
      if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
        return origin;
      }
      // Default: return the configured client URL or first origin
      return env.CLIENT_URL || origin || '';
    },
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH", "PUT"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  }),
);

app
  .on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))
  .route("/todos", todos)
  .route("/chats", chats);

export type AppType = typeof app;
export default app;

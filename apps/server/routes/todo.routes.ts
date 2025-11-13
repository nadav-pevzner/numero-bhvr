import { Hono } from "hono";
import { authQueries } from "../db/auth";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { HonoEnv } from "../types";

export const todos = new Hono<HonoEnv>().use(authMiddleware).get("/", async (c) => {
  const user = c.get("user");

  try {
    const todos = await authQueries.getTodosByUserId(user.id);
    return c.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos: ", error);
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

import type { Env } from "@numero/env";
import { createMiddleware } from "hono/factory";
import { getChatRepository } from "../db/chat";
import { getEnv } from "../lib/env";

export const dbMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const env = getEnv(c.env);
  const repository = getChatRepository(env);

  // Add repository to context
  c.set("chatRepository", repository);

  await next();
});

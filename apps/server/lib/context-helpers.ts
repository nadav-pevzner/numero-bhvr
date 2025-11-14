import type { Context } from "hono";
import type { Env } from "@numero/env";
import { getEnv } from "./env";
import { getChatRepository } from "../db/chat";

/**
 * Helper to get environment variables from Hono context
 */
export function getEnvFromContext(c: Context<{ Bindings: Env }>): Env {
  return getEnv(c.env);
}

/**
 * Helper to get chat repository from Hono context
 */
export function getChatRepoFromContext(c: Context<{ Bindings: Env }>) {
  const env = getEnvFromContext(c);
  return getChatRepository(env);
}

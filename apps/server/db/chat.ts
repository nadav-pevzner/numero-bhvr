import { createChatDb, createChatRepository } from "@numero/chat-db";
import { env } from "@numero/env";
export const chatDb = createChatDb(env.CHAT_DB_URL);
export const chatRepository = createChatRepository(chatDb);

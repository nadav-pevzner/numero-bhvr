import type { ChatRepository } from "@numero/chat-db";
import type { auth } from "./lib/auth";

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    chatRepo: ChatRepository;
    session: typeof auth.$Infer.Session.session;
  };
};

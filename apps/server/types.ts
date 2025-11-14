import type { Session, User } from "better-auth/types";
import type { ChatRepository } from "@numero/chat-db";

export type HonoEnv = {
  Variables: {
    user: User;
    chatRepo: ChatRepository;
    session: Session;
  };
};

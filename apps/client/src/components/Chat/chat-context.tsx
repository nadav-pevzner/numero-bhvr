// features/math-assistant/chat-context.tsx

import type { ConversationWithQuestions, QuestionWithMessages } from "@/types";
import type { Message, Question } from "@numero/chat-db";
import { createContext, type ReactNode, useContext } from "react";

type ChatContextValue = {
  conversations: ConversationWithQuestions[];

  currentConversationId: number | null;
  setCurrentConversationId: (id: number) => void;

  currentQuestionId: number | null;
  setCurrentQuestionId: (id: number | null) => void;

  currentConversation: ConversationWithQuestions | null;
  currentQuestion: QuestionWithMessages | null;

  isLoading: boolean;
  loadingQuestionId: number | null;

  conversationMessages: Message[];

  getStatusColor: (status: Question["status"]) => string;
};

const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = ChatContextValue & {
  children: ReactNode;
};

export function ChatProvider({ children, ...value }: ChatProviderProps) {
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return ctx;
}

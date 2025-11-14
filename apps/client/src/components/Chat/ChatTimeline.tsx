// features/math-assistant/ChatTimeline.tsx

import type { QuestionWithMessages } from "@/types";
import { Message } from "@numero/ui/Chat/Message";
import { MathJax } from "better-react-mathjax";
import React from "react";
import { useChatContext } from "./chat-context";
import QuestionsPanel from "./QuestionsPanel";

type Props = {
  questionRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
};

// Translation helpers
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "פעיל",
    partial: "חלקי",
    solved: "פתור",
    failed: "בוטל",
  };
  return statusMap[status] || status;
};

const translateDifficulty = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    easy: "קל",
    medium: "בינוני",
    hard: "קשה",
  };
  return difficultyMap[difficulty] || difficulty;
};

const formatMessageContent = (content: string): string => {
  return content.replace(/\\n/g, "\n");
};

const ChatTimeline: React.FC<Props> = ({ questionRefs, messageRefs }) => {
  const {
    conversations,
    currentConversationId,
    currentQuestionId,
    isLoading,
    loadingQuestionId,
    conversationMessages,
    getStatusColor,
    setCurrentQuestionId,
  } = useChatContext();

  const currentConversation =
    currentConversationId != null
      ? (conversations.find((c) => c.id === currentConversationId) ?? null)
      : null;

  const questions: QuestionWithMessages[] = currentConversation?.questions ?? [];
  const hasConversationMessages = conversationMessages.length > 0;
  const hasQuestions = questions.length > 0;

  const sideClass = "left-0 lg:pl-0";
  const padClass = "lg:pl-96";

  const scrollToQuestion = (questionId: number) => {
    setTimeout(() => {
      const el = questionRefs.current[questionId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const handleSelectQuestion = (id: number) => {
    setCurrentQuestionId(id);
    scrollToQuestion(id);
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className={`h-full overflow-y-auto p-6 space-y-6 ${padClass}`}>
        {!hasQuestions && !hasConversationMessages ? (
          <div className="text-center text-xl mt-8">
            אין תרגילים בשיחה זו. התחילו עם תרגיל חדש ✨
          </div>
        ) : (
          questions.map((question, questionIndex) => (
            <div key={question.id}>
              <div
                ref={(el) => {
                  questionRefs.current[question.id] = el;
                }}
                className="flex items-center gap-3 mb-3 w-full"
              >
                <div
                  className={`text-xs w-full justify-center items-center text-center px-3 py-1 rounded-full border ${
                    currentQuestionId === question.id
                      ? "bg-purple-200 text-secondary-text border-purple-400"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  תרגיל {questionIndex + 1} • {question.subject} •{" "}
                  {translateDifficulty(question.difficulty)} •
                  <span
                    className={`ml-1 rounded-full px-2 py-px ${getStatusColor(question.status)}`}
                  >
                    {translateStatus(question.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {question.messages?.map((msg, idx) => {
                  const key = `${question.id}-${idx}`;
                  return (
                    <MathJax dynamic hideUntilTypeset="every" key={key}>
                      <Message
                        role={msg.role}
                        content={formatMessageContent(msg.content)}
                        onNodeRef={(el) => {
                          messageRefs.current[key] = el;
                        }}
                      />
                    </MathJax>
                  );
                })}

                {isLoading && loadingQuestionId === question.id && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {hasConversationMessages && (
          <div className="space-y-3 p-4">
            {conversationMessages.map((msg, idx) => (
              <MathJax dynamic hideUntilTypeset="every" key={`conversation-${idx}-${msg.role}`}>
                <Message role={msg.role} content={formatMessageContent(msg.content)} />
              </MathJax>
            ))}

            {isLoading && loadingQuestionId === null && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className={`hidden lg:block absolute top-0 bottom-0 w-96 ${sideClass} z-20`}>
        <div className="sticky top-0 h-full p-3">
          <div className="h-full rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-sm overflow-hidden">
            <QuestionsPanel />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default React.memo(ChatTimeline);

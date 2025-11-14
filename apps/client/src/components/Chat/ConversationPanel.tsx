// features/math-assistant/ConversationsPanel.tsx

import type { ConversationWithQuestions, QuestionResponse } from "@/types";
import { Button } from "@numero/ui/Button";
import { MathJax } from "better-react-mathjax";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useChatContext } from "./chat-context";

// Helper to find the last active question
const findLastActiveQuestion = (questions: QuestionResponse[]): QuestionResponse | null => {
  if (!questions || questions.length === 0) return null;

  const activeQuestions = questions.filter((q) => q.status === "active");
  if (activeQuestions.length > 0) {
    return activeQuestions.reduce((latest, current) =>
      new Date(current.startTime) > new Date(latest.startTime) ? current : latest,
    );
  }

  return questions.reduce((latest, current) =>
    new Date(current.startTime) > new Date(latest.startTime) ? current : latest,
  );
};

type Props = {
  onCreate: () => void;
  onDelete: (id: number) => void;
};

const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "פעיל",
    partial: "חלקי",
    solved: "פתור",
    failed: "בוטל",
  };
  return statusMap[status] || status;
};

const ConversationsPanel: React.FC<Props> = React.memo(({ onCreate, onDelete }) => {
  const {
    conversations,
    currentConversationId,
    currentQuestionId,
    setCurrentConversationId,
    setCurrentQuestionId,
    getStatusColor,
  } = useChatContext();

  const [expandedConversations, setExpandedConversations] = useState<Set<number>>(
    new Set(currentConversationId ? [currentConversationId] : []),
  );

  const toggleExpanded = (id: number) => {
    setExpandedConversations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectConversation = (conv: ConversationWithQuestions) => {
    setCurrentConversationId(conv.id);
    const lastActiveQuestion = findLastActiveQuestion(conv.questions ?? []);
    if (lastActiveQuestion) {
      setCurrentQuestionId(lastActiveQuestion.id);
    } else {
      setCurrentQuestionId(null);
    }
  };

  const handleSelectQuestion = (conv: ConversationWithQuestions, q: QuestionResponse) => {
    setCurrentConversationId(conv.id);
    setCurrentQuestionId(q.id);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 rtl">
        {conversations.map((conv) => {
          const isActive = conv.id === currentConversationId;
          const isExpanded = expandedConversations.has(conv.id);

          return (
            <div
              key={conv.id}
              className={`rounded-lg border transition-all ${
                isActive ? "border-gray-400 bg-gray-200" : "border-gray-400 hover:border-gray-300"
              }`}
            >
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(conv.id)}
                    className="flex items-center gap-1 flex-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-800 flex-1">{conv.name}</span>
                  </button>
                  <div className="flex gap-1">
                    {conversations.length > 1 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        variant={"icon"}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectConversation(conv)}
                  className="mt-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {(conv.questions?.length ?? 0) === 1 ? "שאלה אחת" : `${conv.questions?.length ?? 0} שאלות`}
                </button>
              </div>

              {isExpanded && (conv.questions?.length ?? 0) > 0 && (
                <div className="border-t border-gray-200 bg-gray-50/50">
                  <div className="p-2 space-y-1">
                    {conv.questions?.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectQuestion(conv, q)}
                        className={`w-full p-2 rounded transition-all ${
                          currentQuestionId === q.id
                            ? "bg-gray-200"
                            : "border-transparent hover:border-gray-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-600">{q.subject}</span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(
                              q.status,
                            )}`}
                          >
                            {translateStatus(q.status)}
                          </span>
                        </div>
                        <MathJax dynamic hideUntilTypeset="every" key={q.id}>
                          <p className="text-xs text-gray-700 line-clamp-2">{q.question}</p>
                        </MathJax>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-4 border-b border-gray-200 w-full">
        <Button onClick={onCreate} className="w-full">
          <span className="text-md font-semibold">התחל שיחה חדשה</span>
        </Button>
      </div>
    </div>
  );
});

ConversationsPanel.displayName = "ConversationsPanel";

export default ConversationsPanel;

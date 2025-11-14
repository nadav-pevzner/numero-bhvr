import { useConversations } from "@/hooks/useConversations";
import { apiClient } from "@/lib/api-client";
import { getStatusColor, mathJaxConfig } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import type { MessageResponse, QuestionWithMessages } from "@/types";
import { MathJaxContext } from "better-react-mathjax";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatTimeline from "./ChatTimeline";
import ConversationsPanel from "./ConversationPanel";
import { ChatProvider, type ConversationMessage } from "./chat-context";

export function ChatComponent() {
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [conversationMessagesByConversation, setConversationMessagesByConversation] = useState<
    Record<number, ConversationMessage[]>
  >({});

  // Get conversations data and mutations
  const {
    data: conversations = [],
    isLoading,
    createConversation,
    deleteConversation,
    addQuestionLocal,
    updateQuestionsLocal,
  } = useConversations();

  // UI Store
  const {
    currentConversationId,
    currentQuestionId,
    setCurrentConversation,
    setCurrentQuestion,
    inputMessage,
    clearInputMessage,
    pendingImage,
    clearPendingImage,
    setPendingImage,
    isLoading: isUiLoading,
    setIsLoading,
  } = useUiStore();

  const [loadingQuestionId, setLoadingQuestionId] = useState<number | null>(null);

  const conversationMessages =
    currentConversationId != null
      ? conversationMessagesByConversation[currentConversationId] ?? []
      : [];

  const appendConversationExchange = (conversationId: number, userContent: string, assistantContent: string) => {
    const timestamp = Date.now();
    const userMessage: ConversationMessage = {
      id: `user-${timestamp}`,
      role: "user",
      content: userContent,
      createdAt: new Date(timestamp).toISOString(),
    };
    const assistantMessage: ConversationMessage = {
      id: `assistant-${timestamp + 1}`,
      role: "assistant",
      content: assistantContent,
      createdAt: new Date(timestamp + 1).toISOString(),
    };

    setConversationMessagesByConversation((prev) => {
      const existing = prev[conversationId] ?? [];
      return {
        ...prev,
        [conversationId]: [...existing, userMessage, assistantMessage],
      };
    });
  };

  const handleGeneralConversation = (opts: {
    conversationId: number;
    userMessageContent: string;
    assistantResponse: string;
  }) => {
    appendConversationExchange(opts.conversationId, opts.userMessageContent, opts.assistantResponse);
    clearInputMessage();
    clearPendingImage();
    setLoadingQuestionId(null);
  };
  // Initialize first conversation as current if none selected
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations, currentConversationId, setCurrentConversation]);

  const currentConversation = conversations.find((c) => c.id === currentConversationId) ?? null;
  const currentQuestion =
    currentQuestionId != null && currentConversation
      ? (currentConversation.questions?.find(
          (q: QuestionWithMessages) => q.id === currentQuestionId,
        ) ?? null)
      : null;

  const handleCreateConversation = async () => {
    try {
      await createConversation("שיחה חדשה");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      await deleteConversation(id);
      if (currentConversationId === id && conversations.length > 1) {
        const remainingConvs = conversations.filter((c) => c.id !== id);
        if (remainingConvs.length > 0) {
          setCurrentConversation(remainingConvs[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !pendingImage) return;
    if (!currentConversationId) return;

    const conversationId = currentConversationId;
    setIsLoading(true);

    try {
      // If there's a pending image, handle it first
      if (pendingImage) {
        await handleImageAnalysis();
        return;
      }

      // Parse user input to determine intent
      console.log("Sending parse-input request with:", { userInput: inputMessage });
      const parseResp = await apiClient.api.chats["parse-input"].$post({
        json: { userInput: inputMessage },
      });

      console.log("Parse response status:", parseResp.status);
      if (!parseResp.ok) {
        const errorText = await parseResp.text();
        console.error("Parse input failed:", errorText);
        throw new Error("Failed to parse input");
      }
      const parsed = await parseResp.json();
      console.log("Parsed result:", parsed);

      // If user is asking for a new question (request_question)
      if (parsed.intent === "request_question") {
        if (!parsed.subject) {
          handleGeneralConversation({
            conversationId,
            userMessageContent: inputMessage,
            assistantResponse:
              parsed.response ?? "נושא זה לא זמין כרגע, אשמח לעזור בנושאים אחרים מהתכנית.",
          });
          return;
        }

        const resp = await apiClient.api.chats["generate-question"].$post({
          json: {
            conversationId: currentConversationId,
            subject: parsed.subject,
            difficulty: parsed.difficulty || "medium",
          },
        });

        if (!resp.ok) throw new Error("Failed to generate question");
        const result = await resp.json();

        const initialMessage: MessageResponse | undefined = result.message
          ? {
              ...result.message,
              createdAt:
                typeof result.message.createdAt === "string"
                  ? result.message.createdAt
                  : new Date(result.message.createdAt).toISOString(),
            }
          : undefined;

        // Add question to local state
        addQuestionLocal(currentConversationId, {
          id: result.id,
          conversationId: currentConversationId,
          userId: "",
          subject: result.subject,
          question: result.question,
          difficulty: result.difficulty,
          origin: "llm-generated",
          status: "active",
          imageUrl: null,
          startTime: new Date().toISOString(),
          endTime: null,
          deletedAt: null,
          createdAt: new Date().toISOString(),
          messages: initialMessage ? [initialMessage] : [],
        } as QuestionWithMessages);

        setCurrentQuestion(result.id);
        clearInputMessage();
      }
      // If user provided question text (paste_question)
      else if (parsed.intent === "paste_question" && parsed.extractedQuestion && parsed.subject) {
        const resp = await apiClient.api.chats["create-question-from-text"].$post({
          json: {
            conversationId: currentConversationId,
            questionText: parsed.extractedQuestion,
            subject: parsed.subject,
            difficulty: parsed.difficulty || "medium",
          },
        });

        if (!resp.ok) throw new Error("Failed to create question from text");
        const result = await resp.json();

        const initialMessage: MessageResponse | undefined = result.message
          ? {
              ...result.message,
              createdAt:
                typeof result.message.createdAt === "string"
                  ? result.message.createdAt
                  : new Date(result.message.createdAt).toISOString(),
            }
          : undefined;

        addQuestionLocal(currentConversationId, {
          id: result.id,
          conversationId: currentConversationId,
          userId: "",
          subject: result.subject,
          question: result.question,
          difficulty: result.difficulty,
          origin: "user-text",
          status: "active",
          imageUrl: null,
          startTime: new Date().toISOString(),
          endTime: null,
          deletedAt: null,
          createdAt: new Date().toISOString(),
          messages: initialMessage ? [initialMessage] : [],
        } as QuestionWithMessages);

        setCurrentQuestion(result.id);
        clearInputMessage();
      }
      // General conversational response
      else if (parsed.intent === "chat") {
        handleGeneralConversation({
          conversationId,
          userMessageContent: inputMessage,
          assistantResponse: parsed.response ?? "",
        });

        return; // early return after handling conversation-level response
      }
      // If user is answering a question (chat)
      else if (currentQuestionId && currentQuestion) {
        setLoadingQuestionId(currentQuestionId);

        const messages = [
          ...(currentQuestion.messages?.map((m: any) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })) || []),
          {
            role: "user" as const,
            content: inputMessage,
          },
        ];

        const resp = await apiClient.api.chats["handle-message"].$post({
          json: {
            questionId: currentQuestionId,
            messages,
            questionContext: {
              subject: currentQuestion.subject,
              question: currentQuestion.question,
              difficulty: currentQuestion.difficulty,
              status: currentQuestion.status,
            },
          },
        });

        if (!resp.ok) throw new Error("Failed to handle message");
        const result = await resp.json();

        // Update question messages locally
        updateQuestionsLocal(currentConversationId, (questions) =>
          questions.map((q) =>
            q.id === currentQuestionId
              ? ({
                  ...q,
                  status: result.statusUpdate,
                } as QuestionWithMessages)
              : q,
          ),
        );

        clearInputMessage();
        setLoadingQuestionId(null);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoadingQuestionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewQuestion = async () => {
    if (!currentConversationId) return;

    setIsLoading(true);

    try {
      const resp = await apiClient.api.chats["generate-question"].$post({
        json: {
          conversationId: currentConversationId,
          subject: "אלגברה",
          difficulty: "medium",
        },
      });

      if (!resp.ok) throw new Error("Failed to generate question");
      const result = await resp.json();

      const initialMessage: MessageResponse | undefined = result.message
        ? {
            ...result.message,
            createdAt:
              typeof result.message.createdAt === "string"
                ? result.message.createdAt
                : new Date(result.message.createdAt).toISOString(),
          }
        : undefined;

      addQuestionLocal(currentConversationId, {
        id: result.id,
        conversationId: currentConversationId,
        userId: "",
        subject: result.subject,
        question: result.question,
        difficulty: result.difficulty,
        origin: "llm-generated",
        status: "active",
        imageUrl: null,
        startTime: new Date().toISOString(),
        endTime: null,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        messages: initialMessage ? [initialMessage] : [],
      } as QuestionWithMessages);

      setCurrentQuestion(result.id);
    } catch (error) {
      console.error("Failed to generate question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesAdded = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    // Only handle images
    if (!file.type.startsWith("image/")) {
      console.error("Only image files are supported");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      const base64WithoutPrefix = base64Data.split(",")[1];

      setPendingImage({
        base64Data: base64WithoutPrefix,
        mimeType: file.type,
        previewUrl: base64Data,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await handleFilesAdded(Array.from(files));
    }
  };

  const handleImageAnalysis = async () => {
    if (!pendingImage || !currentConversationId) return;

    setIsLoading(true);

    try {
      const resp = await apiClient.api.chats["analyze-image"].$post({
        json: {
          conversationId: currentConversationId,
          imageData: pendingImage.base64Data,
          mimeType: pendingImage.mimeType,
        },
      });

      if (!resp.ok) throw new Error("Failed to analyze image");
      const result = await resp.json();

      if (!result.inCurriculum) {
        alert("התמונה לא מכילה תרגיל מתמטי מהתכנית");
        clearPendingImage();
        clearInputMessage();
        return;
      }

      addQuestionLocal(currentConversationId, {
        id: result.id,
        conversationId: currentConversationId,
        userId: "",
        subject: result.subject,
        question: result.question,
        difficulty: result.difficulty,
        origin: "user-upload",
        status: "active",
        imageUrl: pendingImage.previewUrl,
        startTime: new Date().toISOString(),
        endTime: null,
        deletedAt: null,
        createdAt: new Date().toISOString(),
      } as QuestionWithMessages);

      setCurrentQuestion(result.id);
      clearPendingImage();
      clearInputMessage();
    } catch (error) {
      console.error("Failed to analyze image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MathJaxContext version={3} config={mathJaxConfig}>
        <ChatProvider
          conversations={conversations}
          currentConversationId={currentConversationId}
          setCurrentConversationId={setCurrentConversation}
          currentQuestionId={currentQuestionId}
          setCurrentQuestionId={setCurrentQuestion}
          currentConversation={currentConversation}
          currentQuestion={currentQuestion}
          isLoading={isLoading || isUiLoading}
          loadingQuestionId={loadingQuestionId}
          conversationMessages={conversationMessages}
          getStatusColor={getStatusColor}
        >
          <ConversationsPanel
            onCreate={handleCreateConversation}
            onDelete={handleDeleteConversation}
          />
          <div className="flex-1 flex flex-col math-paper-bg">
            <ChatHeader
              currentConversation={currentConversation}
              currentQuestion={currentQuestion}
            />
            <ChatTimeline questionRefs={questionRefs} messageRefs={messageRefs} />
            <ChatInput
              onSend={handleSendMessage}
              onGenerateQuestion={generateNewQuestion}
              onUploadImage={() => fileInputRef.current?.click()}
              onFilesAdded={handleFilesAdded}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </ChatProvider>
      </MathJaxContext>
    </div>
  );
}

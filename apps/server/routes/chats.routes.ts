import type { Content } from "@google/genai";
import { Hono } from "hono";
import type { z } from "zod";
import { chatRepository } from "../db/chat";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getCurriculumForLLM } from "../services/curriculum";
import { streamStructured } from "../services/gemini";
import type { Message } from "@numero/chat-db";
import type {
  difficultySchema,
  questionOriginSchema,
  questionStatusSchema,
} from "../services/llm-schema";
import {
  analyzeImageLLMSchema,
  createQuestionFromTextLLMSchema,
  generateQuestionLLMSchema,
  handleMessageSchema,
  nameConversationSchema,
  parseInputSchema,
} from "../services/llm-schema";
import {
  analyzeImagePrompt,
  createQuestionFromTextPrompt,
  generateQuestionPrompt,
  handleMessagePrompt,
  nameConversationPrompt,
  parseInputPrompt,
} from "../services/prompts";
import type { HonoEnv } from "../types";

const {
  createConversation,
  createMessage,
  createQuestion,
  deleteConversation,
  getUserConversations,
  initializeUserConversations,
  updateConversationName,
  updateQuestionStatus,
} = chatRepository;

type ParseInputRequest = { userInput: string };
type ParseInputResponse = z.infer<typeof parseInputSchema>;

type GenerateQuestionRequest = {
  conversationId: number;
  subject: string;
  difficulty: z.infer<typeof difficultySchema>;
};
type GenerateQuestionResponse = {
  id: number;
  subject: string;
  question: string;
  difficulty: z.infer<typeof difficultySchema>;
  userMessage: string;
  message: Message;
};

type CreateQuestionFromTextRequest = {
  conversationId: number;
  questionText: string;
  subject: string;
  difficulty: z.infer<typeof difficultySchema>;
};
type CreateQuestionFromTextResponse = {
  id: number;
  subject: string;
  question: string;
  difficulty: z.infer<typeof difficultySchema>;
  userMessage: string;
  message: Message;
};

type MessageContent = string | Array<{ type: "text"; text: string } | { type: "image" }>;

type HandleMessageRequest = {
  questionId: number;
  messages: Array<{
    role: "user" | "assistant";
    content: MessageContent;
  }>;
  questionContext: {
    subject: string;
    question: string;
    difficulty: z.infer<typeof difficultySchema>;
    status: z.infer<typeof questionStatusSchema>;
  };
};
type HandleMessageResponse = z.infer<typeof handleMessageSchema>;

type AnalyzeImageRequest = {
  conversationId: number;
  imageData: string;
  mimeType: string;
};
type AnalyzeImageResponse = {
  id: number;
  subject: string;
  question: string;
  difficulty: z.infer<typeof difficultySchema>;
  userMessage: string;
  inCurriculum: boolean;
  message: Message | null;
};

const composeInitialQuestionMessage = (intro: string, question: string): string => {
  const trimmedIntro = intro?.trim() || "";
  const trimmedQuestion = question?.trim() || "";

  if (!trimmedQuestion) return trimmedIntro;
  if (!trimmedIntro) return trimmedQuestion;
  if (trimmedIntro.includes(trimmedQuestion)) return trimmedIntro;

  return `${trimmedIntro}\n\n${trimmedQuestion}`;
};

function buildTranscript(messages: HandleMessageRequest["messages"]): string {
  return messages
    .map((m) => {
      const speaker = m.role === "user" ? "תלמיד" : "עוזר";

      const text =
        typeof m.content === "string"
          ? m.content
          : m.content.map((part) => (part.type === "text" ? part.text : "[תמונה]")).join(" ");

      return `${speaker}: ${text}`;
    })
    .join("\n");
}

async function generateConversationName(questionText: string, subject: string): Promise<string> {
  try {
    const prompt = nameConversationPrompt(questionText, subject);
    const result = await streamStructured({
      contents: prompt,
      schema: nameConversationSchema,
    });
    return result.name;
  } catch (error) {
    console.error("Error generating conversation name:", error);
    return subject || "שיחה חדשה";
  }
}

async function nameConversationIfNeeded(
  conversationId: number,
  userId: string,
  questionText: string,
  subject: string,
): Promise<string | null> {
  try {
    const conversations = await getUserConversations(userId);
    const conversation = conversations.find((c) => c.id === conversationId);

    if (
      conversation &&
      (conversation.name.startsWith("שיחה ") || conversation.name === "New Conversation")
    ) {
      const newName = await generateConversationName(questionText, subject);
      await updateConversationName(conversationId, userId, newName);
      return newName;
    }
  } catch (error) {
    console.error("Error naming conversation:", error);
  }
  return null;
}

async function createQuestionWithMessage(
  conversationId: number,
  userId: string,
  llmData: {
    subject: string;
    question: string;
    difficulty: z.infer<typeof difficultySchema>;
    userMessage: string;
  },
  origin: z.infer<typeof questionOriginSchema>,
  imageUrl?: string,
): Promise<{
  question: NonNullable<Awaited<ReturnType<typeof createQuestion>>>;
  initialMessage: string;
  message: Awaited<ReturnType<typeof createMessage>>;
}> {
  const question = await createQuestion(conversationId, userId, {
    subject: llmData.subject,
    question: llmData.question,
    difficulty: llmData.difficulty,
    origin,
    status: "active",
    ...(imageUrl && { imageUrl }),
  });

  if (!question) {
    throw new Error("Failed to create question in database");
  }

  const initialMessage = composeInitialQuestionMessage(llmData.userMessage, llmData.question);

  const message = await createMessage({
    questionId: question.id,
    userId,
    role: "assistant",
    content: initialMessage,
  });

  await nameConversationIfNeeded(conversationId, userId, llmData.question, llmData.subject);
  return { question, initialMessage, message };
}

export const chats = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get("/conversations", async (c) => {
    const user = c.get("user");

    try {
      const conversations = await getUserConversations(user.id);
      return c.json(conversations);
    } catch (error) {
      console.error("Failed to fetch conversations: ", error);
      return c.json({ error: "Failed to fetch conversations" }, 500);
    }
  })

  .post("/conversations", async (c) => {
    const user = c.get("user");

    try {
      const { name } = await c.req.json<{ name: string }>();
      const conversation = await createConversation(user.id, name);
      return c.json(conversation, 201);
    } catch (error) {
      console.error("Failed to create conversation: ", error);
      return c.json({ error: "Failed to create conversation" }, 500);
    }
  })

  .patch("/conversations/:id", async (c) => {
    const user = c.get("user");

    try {
      const conversationId = Number.parseInt(c.req.param("id"), 10);
      const { name } = await c.req.json<{ name: string }>();

      const updated = await updateConversationName(conversationId, user.id, name);

      if (!updated) {
        return c.json({ error: "Conversation not found" }, 404);
      }

      return c.json(updated);
    } catch (error) {
      console.error("Failed to update conversation: ", error);
      return c.json({ error: "Failed to update conversation" }, 500);
    }
  })

  .delete("/conversations/:id", async (c) => {
    const user = c.get("user");

    try {
      const conversationId = Number.parseInt(c.req.param("id"), 10);

      const deleted = await deleteConversation(conversationId, user.id);

      if (!deleted) {
        return c.json({ error: "Conversation not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      console.error("Failed to delete conversation: ", error);
      return c.json({ error: "Failed to delete conversation" }, 500);
    }
  })

  .post("/conversations/initialize", async (c) => {
    const user = c.get("user");

    try {
      const conversation = await initializeUserConversations(user.id);

      if (conversation) {
        return c.json(conversation, 201);
      }

      const conversations = await getUserConversations(user.id);
      return c.json(conversations[0]);
    } catch (error) {
      console.error("Failed to initialize conversation: ", error);
      return c.json({ error: "Failed to initialize conversation" }, 500);
    }
  })

  .post("/parse-input", async (c) => {
    try {
      const body = await c.req.json<ParseInputRequest>();
      console.log("Received parse-input request:", body);
      const { userInput } = body;

      const curriculum = await getCurriculumForLLM();
      const prompt = parseInputPrompt(userInput, curriculum);
      console.log("Generated prompt:", prompt.substring(0, 200) + "...");

      const parsed = await streamStructured({
        contents: prompt,
        schema: parseInputSchema,
      });
      console.log("LLM parsed result:", parsed);

      return c.json<ParseInputResponse>(parsed);
    } catch (error) {
      console.error("Failed to parse input: ", error);
      return c.json({ error: "Failed to parse input" }, 500);
    }
  })

  .post("/generate-question", async (c) => {
    const user = c.get("user");

    try {
      const { conversationId, subject, difficulty } = await c.req.json<GenerateQuestionRequest>();

      const curriculum = await getCurriculumForLLM();
      const prompt = generateQuestionPrompt(subject, difficulty, curriculum);

      const llmData = await streamStructured({
        contents: prompt,
        schema: generateQuestionLLMSchema,
      });

      const { question, initialMessage, message } = await createQuestionWithMessage(
        conversationId,
        user.id,
        llmData,
        "llm-generated",
      );

      return c.json<GenerateQuestionResponse>({
        id: question.id,
        subject: llmData.subject,
        question: llmData.question,
        difficulty: llmData.difficulty,
        userMessage: initialMessage,
        message,
      });
    } catch (error) {
      console.error("Failed to generate question: ", error);
      return c.json({ error: "Failed to generate question" }, 500);
    }
  })

  .post("/create-question-from-text", async (c) => {
    const user = c.get("user");

    try {
      const { conversationId, questionText, subject, difficulty } =
        await c.req.json<CreateQuestionFromTextRequest>();

      const prompt = createQuestionFromTextPrompt(questionText, subject, difficulty);

      const llmData = await streamStructured({
        contents: prompt,
        schema: createQuestionFromTextLLMSchema,
      });

      const { question, initialMessage, message } = await createQuestionWithMessage(
        conversationId,
        user.id,
        llmData,
        "user-text",
      );

      return c.json<CreateQuestionFromTextResponse>({
        id: question.id,
        subject: llmData.subject,
        question: llmData.question,
        difficulty: llmData.difficulty,
        userMessage: initialMessage,
        message,
      });
    } catch (error) {
      console.error("Failed to create question from text: ", error);
      return c.json({ error: "Failed to create question from text" }, 500);
    }
  })

  .post("/handle-message", async (c) => {
    const user = c.get("user");

    try {
      const { questionId, messages, questionContext } = await c.req.json<HandleMessageRequest>();

      const lastUserMessage = messages[messages.length - 1];

      if (!lastUserMessage) {
        return c.json({ error: "No message provided" }, 400);
      }

      const basePrompt = handleMessagePrompt(questionContext);
      const transcript = buildTranscript(messages);

      const prompt = `${basePrompt}

להלן השיחה עד כה (תלמיד = user, עוזר = assistant):

${transcript}
`;

      const llmData = await streamStructured({
        contents: prompt,
        schema: handleMessageSchema,
      });

      if (lastUserMessage.role === "user") {
        const userContent =
          typeof lastUserMessage.content === "string"
            ? lastUserMessage.content
            : lastUserMessage.content.find((c) => c.type === "text")?.text || "";

        await createMessage({
          questionId,
          userId: user.id,
          role: "user",
          content: userContent,
        });
      }

      await createMessage({
        questionId,
        userId: user.id,
        role: "assistant",
        content: llmData.message,
      });

      if (llmData.statusUpdate !== questionContext.status) {
        await updateQuestionStatus(
          questionId,
          user.id,
          llmData.statusUpdate,
          llmData.shouldEndSegment ? new Date() : undefined,
        );
      }

      return c.json<HandleMessageResponse>(llmData);
    } catch (error) {
      console.error("Failed to handle message: ", error);
      return c.json({ error: "Failed to handle message" }, 500);
    }
  })

  .post("/analyze-image", async (c) => {
    const user = c.get("user");

    try {
      const { conversationId, imageData, mimeType } = await c.req.json<AnalyzeImageRequest>();

      const curriculum = await getCurriculumForLLM();
      const prompt = analyzeImagePrompt(curriculum);

      const contents: Content[] = [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: imageData,
              },
            },
          ],
        },
      ];

      const llmData = await streamStructured({
        contents,
        schema: analyzeImageLLMSchema,
      });

      if (!llmData.inCurriculum) {
        return c.json<AnalyzeImageResponse>({
          ...llmData,
          id: 0,
          message: null,
        });
      }

      const { question, initialMessage, message } = await createQuestionWithMessage(
        conversationId,
        user.id,
        llmData,
        "user-upload",
        imageData,
      );

      return c.json<AnalyzeImageResponse>({
        id: question.id,
        subject: llmData.subject,
        question: llmData.question,
        difficulty: llmData.difficulty,
        userMessage: initialMessage,
        inCurriculum: llmData.inCurriculum,
        message,
      });
    } catch (error) {
      console.error("Failed to analyze image: ", error);
      return c.json({ error: "Failed to analyze image" }, 500);
    }
  });

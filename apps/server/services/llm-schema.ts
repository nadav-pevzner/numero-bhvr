// services/llm-schemas.ts

import { conversations, messages, questions } from "@numero/chat-db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const questionStatusSchema = createSelectSchema(questions).shape.status;
export const questionOriginSchema = createSelectSchema(questions).shape.origin;
export const difficultySchema = createSelectSchema(questions).shape.difficulty;
export const roleSchema = createSelectSchema(messages).shape.role;

export const insertQuestionSchema = createInsertSchema(questions);
export const selectQuestionSchema = createSelectSchema(questions);

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export const insertConversationSchema = createInsertSchema(conversations);
export const selectConversationSchema = createSelectSchema(conversations);

export const parseInputSchema = z.object({
  intent: z.enum(["request_question", "paste_question", "chat"]),
  subject: z.string().nullable(),
  extractedQuestion: z.string().nullable(),
  difficulty: difficultySchema.nullable(),
  response: z.string(),
});

export const generateQuestionLLMSchema = z.object({
  subject: z.string(),
  question: z.string(),
  difficulty: difficultySchema,
  userMessage: z.string(),
});

export const createQuestionFromTextLLMSchema = z.object({
  subject: z.string(),
  question: z.string(),
  difficulty: difficultySchema,
  userMessage: z.string(),
});

export const handleMessageSchema = z.object({
  message: z.string(),
  statusUpdate: questionStatusSchema,
  shouldEndSegment: z.boolean(),
  reasoning: z.string().optional(),
});

export const analyzeImageLLMSchema = z.discriminatedUnion("inCurriculum", [
  z.object({
    inCurriculum: z.literal(true),
    subject: z.string(),
    question: z.string(),
    difficulty: difficultySchema,
    userMessage: z.string(),
  }),
  z.object({
    inCurriculum: z.literal(false),
    subject: z.string(),
    question: z.string(),
    difficulty: difficultySchema,
    userMessage: z.string(),
  }),
]);

export const nameConversationSchema = z.object({
  name: z.string(),
});

export const createQuestionInputSchema = insertQuestionSchema.pick({
  conversationId: true,
  userId: true,
  subject: true,
  question: true,
  difficulty: true,
  origin: true,
  status: true,
  imageUrl: true,
});

export const updateQuestionStatusSchema = z.object({
  questionId: z.number(),
  userId: z.string(),
  status: questionStatusSchema,
  endTime: z.date().optional(),
});

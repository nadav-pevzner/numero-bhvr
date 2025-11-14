// services/llm-schemas.ts - CORRECTED TO MATCH DATABASE SCHEMA

import { z } from "zod";

// Define enum schemas directly to avoid drizzle-zod type inference issues with union database types
export const questionStatusSchema = z.enum(["active", "solved", "failed", "partial"]);
export const questionOriginSchema = z.enum(["llm-generated", "user-text", "user-upload", "teacher"]);
export const difficultySchema = z.enum(["easy", "medium", "hard"]);
export const roleSchema = z.enum(["user", "assistant"]);

// Create explicit enums for LLM API calls (ensures proper JSON Schema generation)
// These MUST match your pgEnum definitions exactly:

// From: pgEnum("difficulty", ["easy", "medium", "hard"])
export const difficultyLLMSchema = z.enum(["easy", "medium", "hard"]);

// From: pgEnum("status", ["active", "solved", "failed", "partial"])
export const questionStatusLLMSchema = z.enum(["active", "solved", "failed", "partial"]);

// From: pgEnum("origin", ["llm-generated", "user-text", "user-upload", "teacher"])
export const questionOriginLLMSchema = z.enum([
  "llm-generated",
  "user-text",
  "user-upload",
  "teacher",
]);

// From: pgEnum("role", ["user", "assistant"])
export const roleLLMSchema = z.enum(["user", "assistant"]);

// Manually define schemas to avoid drizzle-zod inference issues with union database types
export const insertQuestionSchema = z.object({
  conversationId: z.number(),
  userId: z.string(),
  subject: z.string(),
  question: z.string(),
  difficulty: difficultySchema,
  origin: questionOriginSchema,
  status: questionStatusSchema.optional(),
  imageUrl: z.string().nullable().optional(),
  startTime: z.date().optional(),
  endTime: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
});

export const selectQuestionSchema = insertQuestionSchema.extend({
  id: z.number(),
  status: questionStatusSchema,
  startTime: z.date(),
  createdAt: z.date(),
});

export const insertMessageSchema = z.object({
  questionId: z.number(),
  userId: z.string(),
  role: roleSchema,
  content: z.string(),
  createdAt: z.date().optional(),
});

export const selectMessageSchema = insertMessageSchema.extend({
  id: z.number(),
  createdAt: z.date(),
});

export const insertConversationSchema = z.object({
  userId: z.string(),
  name: z.string(),
  deletedAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectConversationSchema = insertConversationSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Use explicit enum for LLM structured output
export const parseInputSchema = z.object({
  intent: z.enum(["request_question", "paste_question", "chat"]),
  subject: z.string().nullable(),
  extractedQuestion: z.string().nullable(),
  difficulty: difficultyLLMSchema.nullable(), // Uses: "easy" | "medium" | "hard"
  response: z.string(),
  _raw_response_for_qa: z.string().optional(),
});

// Use the explicit LLM schema for Gemini API calls
export const generateQuestionLLMSchema = z.object({
  subject: z.string(),
  question: z.string(),
  difficulty: difficultyLLMSchema, // "easy" | "medium" | "hard"
  userMessage: z.string(),
});

export const createQuestionFromTextLLMSchema = z.object({
  subject: z.string(),
  question: z.string(),
  difficulty: difficultyLLMSchema, // "easy" | "medium" | "hard"
  userMessage: z.string(),
});

export const handleMessageSchema = z.object({
  message: z.string(),
  statusUpdate: questionStatusLLMSchema, // "active" | "solved" | "failed" | "partial"
  shouldEndSegment: z.boolean(),
  reasoning: z.string().optional(),
});

export const analyzeImageLLMSchema = z.discriminatedUnion("inCurriculum", [
  z.object({
    inCurriculum: z.literal(true),
    subject: z.string(),
    question: z.string(),
    difficulty: difficultyLLMSchema, // "easy" | "medium" | "hard"
    userMessage: z.string(),
  }),
  z.object({
    inCurriculum: z.literal(false),
    subject: z.string(),
    question: z.string(),
    difficulty: difficultyLLMSchema, // "easy" | "medium" | "hard"
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

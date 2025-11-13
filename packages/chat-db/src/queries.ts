import { and, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";
import { conversations, messages, questions } from "./schema";

export function createChatQueries(db: NodePgDatabase<typeof schema>) {
	return {
		getUserConversations: async (userId: string) => {
			return db
				.select()
				.from(conversations)
				.where(eq(conversations.userId, userId))
				.orderBy(desc(conversations.updatedAt));
		},

		getConversationById: async (conversationId: number, userId: string) => {
			const result = await db
				.select()
				.from(conversations)
				.where(
					and(
						eq(conversations.id, conversationId),
						eq(conversations.userId, userId),
					),
				)
				.limit(1);
			return result[0];
		},

		getQuestionsByConversation: async (
			conversationId: number,
			userId: string,
		) => {
			return db
				.select()
				.from(questions)
				.where(
					and(
						eq(questions.conversationId, conversationId),
						eq(questions.userId, userId),
					),
				)
				.orderBy(desc(questions.createdAt));
		},

		getQuestionById: async (questionId: number, userId: string) => {
			const result = await db
				.select()
				.from(questions)
				.where(
					and(
						eq(questions.id, questionId),
						eq(questions.userId, userId),
					),
				)
				.limit(1);
			return result[0];
		},

		getMessagesByQuestion: async (questionId: number, userId: string) => {
			return db
				.select()
				.from(messages)
				.where(
					and(
						eq(messages.questionId, questionId),
						eq(messages.userId, userId),
					),
				)
				.orderBy(messages.createdAt);
		},

		getConversationMessages: async (conversationId: number, userId: string) => {
			return db
				.select({
					message: messages,
					question: questions,
				})
				.from(messages)
				.innerJoin(questions, eq(messages.questionId, questions.id))
				.where(
					and(
						eq(questions.conversationId, conversationId),
						eq(questions.userId, userId),
					),
				)
				.orderBy(messages.createdAt);
		},

		getConversationForNaming: async (
			conversationId: number,
			userId: string,
		) => {
			const result = await db
				.select({
					id: conversations.id,
					name: conversations.name,
				})
				.from(conversations)
				.where(
					and(
						eq(conversations.id, conversationId),
						eq(conversations.userId, userId),
					),
				)
				.limit(1);
			return result[0];
		},
	};
}

import { and, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import {
	conversations,
	grades,
	mainTopics,
	messages,
	questions,
	studyLevels,
	subtopics,
	type NewMessage,
	type NewQuestion,
	type Question,
} from "./schema";

type DbClient = NodePgDatabase<typeof schema>;

export function createChatRepository(db: DbClient) {
	return {
		getUserConversations: (userId: string) =>
			db
				.select()
				.from(conversations)
				.where(eq(conversations.userId, userId))
				.orderBy(desc(conversations.updatedAt)),

		getConversationForNaming: async (conversationId: number, userId: string) => {
			const [row] = await db
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

			return row ?? null;
		},

		createConversation: async (userId: string, name: string) => {
			const [row] = await db
				.insert(conversations)
				.values({ userId, name })
				.returning();
			return row;
		},

		updateConversationName: async (
			conversationId: number,
			userId: string,
			name: string,
		) => {
			const [row] = await db
				.update(conversations)
				.set({ name })
				.where(
					and(
						eq(conversations.id, conversationId),
						eq(conversations.userId, userId),
					),
				)
				.returning();
			return row ?? null;
		},

		deleteConversation: async (conversationId: number, userId: string) => {
			const deleted = await db
				.delete(conversations)
				.where(
					and(
						eq(conversations.id, conversationId),
						eq(conversations.userId, userId),
					),
				)
				.returning({ id: conversations.id });

			return deleted.length > 0;
		},

		initializeUserConversations: async (userId: string) => {
			const existing = await db
				.select({ id: conversations.id })
				.from(conversations)
				.where(eq(conversations.userId, userId))
				.limit(1);

			if (existing.length > 0) {
				return null;
			}

			const defaultName = "שיחה חדשה";

			const [created] = await db
				.insert(conversations)
				.values({
					userId,
					name: defaultName,
				})
				.returning();

			return created;
		},

		createQuestion: async (
			conversationId: number,
			userId: string,
			data: Omit<
				NewQuestion,
				| "id"
				| "conversationId"
				| "userId"
				| "createdAt"
				| "startTime"
				| "endTime"
				| "deletedAt"
			>,
		) => {
			const [row] = await db
				.insert(questions)
				.values({
					...data,
					conversationId,
					userId,
				})
				.returning();
			return row;
		},

		createMessage: async (params: {
			questionId: number;
			userId: string;
			role: NewMessage["role"];
			content: string;
		}) => {
			const [row] = await db
				.insert(messages)
				.values({
					questionId: params.questionId,
					userId: params.userId,
					role: params.role,
					content: params.content,
				})
				.returning();
			return row;
		},

		updateQuestionStatus: async (
			questionId: number,
			userId: string,
			status: Question["status"],
			endTime?: Date,
		) => {
			const [row] = await db
				.update(questions)
				.set({
					status,
					endTime: endTime ?? null,
				})
				.where(
					and(eq(questions.id, questionId), eq(questions.userId, userId)),
				)
				.returning();
			return row ?? null;
		},

		getAllCurriculumTopics: async () => {
			const results = await db
				.select({
					subtopicId: subtopics.id,
					subtopicName: subtopics.name,
					subtopicOrder: subtopics.displayOrder,
					mainTopicId: mainTopics.id,
					mainTopicName: mainTopics.name,
					mainTopicOrder: mainTopics.displayOrder,
					gradeId: grades.id,
					grade: grades.grade,
					studyLevelId: studyLevels.id,
					studyLevel: studyLevels.level,
				})
				.from(subtopics)
				.innerJoin(mainTopics, eq(subtopics.mainTopicId, mainTopics.id))
				.innerJoin(grades, eq(mainTopics.gradeId, grades.id))
				.innerJoin(studyLevels, eq(grades.studyLevelId, studyLevels.id))
				.orderBy(
					studyLevels.level,
					grades.grade,
					mainTopics.displayOrder,
					subtopics.displayOrder,
				);

			return results;
		},
	};
}

export type ChatRepository = ReturnType<typeof createChatRepository>;
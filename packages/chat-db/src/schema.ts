// db/schema.ts

import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
	"active",
	"completed",
	"abandoned",
]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const originEnum = pgEnum("origin", [
	"llm-generated",
	"user-text",
	"user-upload",
]);
export const roleEnum = pgEnum("role", ["user", "assistant"]);

export const conversations = pgTable(
	"conversations",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull(),
		name: text("name").notNull(),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		{
			userIdIdx: index("conversations_user_id_idx").on(table.userId),
			updatedAtIdx: index("conversations_updated_at_idx").on(table.updatedAt),
		},
	],
);

export const questions = pgTable(
	"questions",
	{
		id: serial("id").primaryKey(),
		conversationId: integer("conversation_id")
			.notNull()
			.references(() => conversations.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(), // Added for direct access
		subject: text("subject").notNull(),
		question: text("question").notNull(),
		difficulty: difficultyEnum("difficulty").notNull(),
		origin: originEnum("origin").notNull(),
		status: statusEnum("status").notNull().default("active"),
		imageUrl: text("image_url"), // Changed from imageData
		startTime: timestamp("start_time", { withTimezone: true })
			.notNull()
			.defaultNow(),
		endTime: timestamp("end_time", { withTimezone: true }),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		{
			conversationIdIdx: index("questions_conversation_id_idx").on(
				table.conversationId,
			),
			userStatusIdx: index("questions_user_id_status_idx").on(
				table.userId,
				table.status,
			),
		},
	],
);

export const messages = pgTable(
	"messages",
	{
		id: serial("id").primaryKey(),
		questionId: integer("question_id")
			.notNull()
			.references(() => questions.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(), // Added
		role: roleEnum("role").notNull(),
		content: text("content").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		{
			questionIdIdx: index("messages_question_id_idx").on(table.questionId),
		},
	],
);
export const conversationsRelations = relations(conversations, ({ many }) => ({
	questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
	conversation: one(conversations, {
		fields: [questions.conversationId],
		references: [conversations.id],
	}),
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	question: one(questions, {
		fields: [messages.questionId],
		references: [questions.id],
	}),
}));

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const studyLevels = pgTable("study_levels", {
	id: serial("id").primaryKey(),
	level: varchar("level", { length: 10 }).notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type StudyLevelRecord = typeof studyLevels.$inferSelect;

export const grades = pgTable(
	"grades",
	{
		id: serial("id").primaryKey(),
		studyLevelId: integer("study_level_id")
			.notNull()
			.references(() => studyLevels.id, { onDelete: "cascade" }),
		grade: varchar("grade", { length: 10 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		{
			studyLevelGradeUnique: uniqueIndex("grades_study_level_id_grade_key").on(
				table.studyLevelId,
				table.grade,
			),
			studyLevelIdx: index("idx_grades_study_level").on(table.studyLevelId),
		},
	],
);

export type GradeRecord = typeof grades.$inferSelect;

export const mainTopics = pgTable(
	"main_topics",
	{
		id: serial("id").primaryKey(),
		gradeId: integer("grade_id")
			.notNull()
			.references(() => grades.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 255 }).notNull(),
		displayOrder: integer("display_order").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		{
			gradeNameUnique: uniqueIndex("main_topics_grade_id_name_key").on(
				table.gradeId,
				table.name,
			),
			gradeIdx: index("idx_main_topics_grade").on(table.gradeId),
			orderIdx: index("idx_main_topics_order").on(
				table.gradeId,
				table.displayOrder,
			),
		},
	],
);

export type MainTopicRecord = typeof mainTopics.$inferSelect;

export const subtopics = pgTable(
	"subtopics",
	{
		id: serial("id").primaryKey(),
		mainTopicId: integer("main_topic_id")
			.notNull()
			.references(() => mainTopics.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 255 }).notNull(),
		displayOrder: integer("display_order").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		{
			mainTopicIdx: index("idx_subtopics_main_topic").on(table.mainTopicId),
			orderIdx: index("idx_subtopics_order").on(
				table.mainTopicId,
				table.displayOrder,
			),
		},
	],
);

export type SubtopicRecord = typeof subtopics.$inferSelect;

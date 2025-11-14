CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."origin" AS ENUM('llm-generated', 'user-text', 'user-upload', 'teacher');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'solved', 'failed', 'partial');--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"study_level_id" integer NOT NULL,
	"grade" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"grade_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"role" "role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"subject" text NOT NULL,
	"question" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"origin" "origin" NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"image_url" text,
	"start_time" timestamp with time zone DEFAULT now() NOT NULL,
	"end_time" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "study_levels_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE "subtopics" (
	"id" serial PRIMARY KEY NOT NULL,
	"main_topic_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
DROP TABLE "todos" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;--> statement-breakpoint
DROP TABLE "verification" CASCADE;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_study_level_id_study_levels_id_fk" FOREIGN KEY ("study_level_id") REFERENCES "public"."study_levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main_topics" ADD CONSTRAINT "main_topics_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtopics" ADD CONSTRAINT "subtopics_main_topic_id_main_topics_id_fk" FOREIGN KEY ("main_topic_id") REFERENCES "public"."main_topics"("id") ON DELETE cascade ON UPDATE no action;
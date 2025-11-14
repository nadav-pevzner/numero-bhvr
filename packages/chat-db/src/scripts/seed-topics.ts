#!/usr/bin/env bun
import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import * as schema from "../schema";
import { grades, mainTopics, studyLevels, subtopics } from "../schema";

interface ParsedTopic {
  unit: string; // e.g., "3", "4", "5"
  grade: string; // e.g., "10", "11", "12"
  mainTopics: Array<{
    name: string;
    subtopics: string[];
  }>;
}
const databaseUrl = process.env.CHAT_DB_URL;
if (!databaseUrl) {
  console.error("CHAT_DB_URL is not set. Please export your Neon connection string before seeding.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const chatDb = neonDrizzle(sql, { schema });
/**
 * Parse the topics.md file and extract the structure
 */
async function parseTopicsFile(filePath: string): Promise<ParsedTopic[]> {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");

  const topics: ParsedTopic[] = [];
  let currentTopic: ParsedTopic | null = null;
  let currentMainTopic: { name: string; subtopics: string[] } | null = null;

  for (const line of lines) {
    // Check for unit-grade header (e.g., # 3-10)
    const unitGradeMatch = line.match(/^#\s+(\d+)-(\d+)\s*$/);
    if (unitGradeMatch) {
      // Save previous topic if exists
      if (currentTopic && currentMainTopic) {
        currentTopic.mainTopics.push(currentMainTopic);
        currentMainTopic = null;
      }
      if (currentTopic) {
        topics.push(currentTopic);
      }

      // Start new topic
      currentTopic = {
        unit: unitGradeMatch[1],
        grade: unitGradeMatch[2],
        mainTopics: [],
      };
      continue;
    }

    // Check for main topic (e.g., ## אשכול מדע וחברה)
    const mainTopicMatch = line.match(/^##\s+(.+)$/);
    if (mainTopicMatch) {
      // Save previous main topic if exists
      if (currentTopic && currentMainTopic) {
        currentTopic.mainTopics.push(currentMainTopic);
      }

      // Start new main topic
      currentMainTopic = {
        name: mainTopicMatch[1].trim(),
        subtopics: [],
      };
      continue;
    }

    // Check for subtopic (e.g., ### גרפים רגילים)
    const subtopicMatch = line.match(/^###\s+(.+)$/);
    if (subtopicMatch && currentMainTopic) {
      currentMainTopic.subtopics.push(subtopicMatch[1].trim());
      continue;
    }
  }

  // Save last main topic and topic
  if (currentTopic && currentMainTopic) {
    currentTopic.mainTopics.push(currentMainTopic);
  }
  if (currentTopic) {
    topics.push(currentTopic);
  }

  return topics;
}

/**
 * Seed the database with parsed topics
 */
async function seedTopics(topics: ParsedTopic[]) {
  console.log("Starting database seeding...");

  for (const topic of topics) {
    const levelName = `${topic.unit}`;
    console.log(`\nProcessing level: ${levelName}, grade: ${topic.grade}`);

    // 1. Insert or get study level
    let studyLevel = await chatDb.query.studyLevels.findFirst({
      where: eq(studyLevels.level, levelName),
    });

    if (!studyLevel) {
      const [newLevel] = await chatDb.insert(studyLevels).values({ level: levelName }).returning();
      studyLevel = newLevel;
      console.log(`  ✓ Created study level: ${levelName}`);
    } else {
      console.log(`  → Study level exists: ${levelName}`);
    }

    // 2. Insert or get grade
    let grade = await chatDb.query.grades.findFirst({
      where: and(eq(grades.studyLevelId, studyLevel.id), eq(grades.grade, topic.grade)),
    });

    if (!grade) {
      const [newGrade] = await chatDb
        .insert(grades)
        .values({
          studyLevelId: studyLevel.id,
          grade: topic.grade,
        })
        .returning();
      grade = newGrade;
      console.log(`  ✓ Created grade: ${topic.grade}`);
    } else {
      console.log(`  → Grade exists: ${topic.grade}`);
    }

    // 3. Insert main topics and subtopics
    for (let i = 0; i < topic.mainTopics.length; i++) {
      const mainTopicData = topic.mainTopics[i];

      // Check if main topic exists
      let mainTopic = await chatDb.query.mainTopics.findFirst({
        where: and(eq(mainTopics.gradeId, grade.id), eq(mainTopics.name, mainTopicData.name)),
      });

      if (!mainTopic) {
        const [newMainTopic] = await chatDb
          .insert(mainTopics)
          .values({
            gradeId: grade.id,
            name: mainTopicData.name,
            displayOrder: i,
          })
          .returning();
        mainTopic = newMainTopic;
        console.log(`    ✓ Created main topic: ${mainTopicData.name}`);
      } else {
        console.log(`    → Main topic exists: ${mainTopicData.name}`);
      }

      // Insert subtopics
      for (let j = 0; j < mainTopicData.subtopics.length; j++) {
        const subtopicName = mainTopicData.subtopics[j];

        // Check if subtopic exists
        const existingSubtopic = await chatDb.query.subtopics.findFirst({
          where: and(eq(subtopics.mainTopicId, mainTopic.id), eq(subtopics.name, subtopicName)),
        });

        if (!existingSubtopic) {
          await chatDb.insert(subtopics).values({
            mainTopicId: mainTopic.id,
            name: subtopicName,
            displayOrder: j,
          });
          console.log(`      ✓ Created subtopic: ${subtopicName}`);
        }
      }
    }
  }

  console.log("\n✨ Database seeding completed successfully!");
}

/**
 * Main execution
 */
async function main() {
  try {
    // Resolve topics.md relative to this script so it works from any cwd
    const topicsPath = join(import.meta.dir, "..", "..", "topics.md");
    console.log(`Reading topics from: ${topicsPath}`);

    const topics = await parseTopicsFile(topicsPath);
    console.log(`\nParsed ${topics.length} unit-grade combinations`);

    await seedTopics(topics);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();

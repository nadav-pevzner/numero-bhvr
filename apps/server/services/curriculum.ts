import { chatRepository } from "../db/chat";

interface CurriculumTopic {
  subtopicId: number;
  subtopicName: string;
  subtopicOrder: number;
  mainTopicId: number;
  mainTopicName: string;
  mainTopicOrder: number;
  gradeId: number;
  grade: string;
  studyLevelId: number;
  studyLevel: string;
}

interface CurriculumCache {
  data: CurriculumTopic[] | null;
  lastFetched: Date | null;
  isLoading: boolean;
}

const cache: CurriculumCache = {
  data: null,
  lastFetched: null,
  isLoading: false,
};

const CACHE_DURATION_MS = 60 * 60 * 1000;

function isCacheValid(): boolean {
  if (!cache.data || !cache.lastFetched) {
    return false;
  }

  const now = new Date();
  const timeSinceLastFetch = now.getTime() - cache.lastFetched.getTime();
  return timeSinceLastFetch < CACHE_DURATION_MS;
}

async function refreshCache(): Promise<void> {
  try {
    cache.isLoading = true;
    const topics = await chatRepository.getAllCurriculumTopics();
    cache.data = topics;
    cache.lastFetched = new Date();
  } catch (error) {
    console.error("Error fetching curriculum topics:", error);
    throw error;
  } finally {
    cache.isLoading = false;
  }
}

export async function getCurriculumTopics(): Promise<CurriculumTopic[]> {
  if (isCacheValid() && cache.data) {
    return cache.data;
  }

  if (cache.isLoading) {
    while (cache.isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (cache.data) {
      return cache.data;
    }
  }

  await refreshCache();

  if (!cache.data) {
    throw new Error("Failed to load curriculum topics");
  }

  return cache.data;
}

export function formatCurriculumForLLM(topics: CurriculumTopic[]): string[] {
  return topics.map((topic) => {
    return `${topic.subtopicName} (${topic.mainTopicName}, כיתה ${topic.grade}, יחידות לימוד ${topic.studyLevel})`;
  });
}

export async function getCurriculumForLLM(): Promise<string[]> {
  const topics = await getCurriculumTopics();
  return formatCurriculumForLLM(topics);
}

export function invalidateCurriculumCache(): void {
  cache.data = null;
  cache.lastFetched = null;
}

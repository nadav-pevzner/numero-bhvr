import type { Question } from "@numero/chat-db";

type Status = NonNullable<Question["status"]>;

export const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "פעיל",
    partial: "חלקי",
    solved: "פתור",
    failed: "בוטל",
  };
  return statusMap[status] || status;
};

export const translateDifficulty = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    easy: "קל",
    medium: "בינוני",
    hard: "קשה",
  };
  return difficultyMap[difficulty] || difficulty;
};

export const getStatusColor = (status: Status) => {
  const colors: Record<Status, string> = {
    active: "bg-blue-100 text-blue-800",
    solved: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
  };
  return colors[status] ?? colors.active;
};

export const mathJaxConfig = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    enableMenu: false,
  },
  startup: {
    typeset: true,
  },
};

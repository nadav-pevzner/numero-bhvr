import type { ContentNode, StructureNode } from "@/types";
import type React from "react";

interface StatusMessagesProps {
  activePlaceholder: {
    structureIndex: number;
    placeholderIndex: number;
  } | null;
  content: ContentNode[];
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({ activePlaceholder, content }) => {
  if (activePlaceholder) {
    const structure = content[activePlaceholder.structureIndex] as StructureNode | undefined;
    const count = structure?.parts.filter((p) => p.type === "placeholder").length || 0;

    return (
      <div className="rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-2 text-amber-900 text-sm text-center">
        <strong>
          עריכת שדה {activePlaceholder.placeholderIndex + 1} מתוך {count}
        </strong>{" "}
        • הקלד טקסט או הוסף תווים • Tab/Shift+Tab לנווט בין שדות • Esc לצאת
      </div>
    );
  }

  if (content.some((i) => i.type === "structure")) {
    return (
      <div className="rounded-lg border-2 border-sky-500 bg-sky-50 px-3 py-2 text-sky-900 text-sm text-center">
        💡 <strong>טיפ:</strong> לחץ על כל מבנה (שברים, שורשים, גבולות) כדי לערוך את התוכן שלו.
      </div>
    );
  }

  return null;
};

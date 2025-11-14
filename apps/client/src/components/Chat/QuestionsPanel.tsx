// features/math-assistant/QuestionsPanel.tsx

import Brain from "@/svgs/brain";
import { MathJax } from "better-react-mathjax";
import React from "react";
import { useChatContext } from "./chat-context";

const QuestionsPanel: React.FC = React.memo(() => {
  const { currentQuestion } = useChatContext();

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-3">
        <div className="text-xs bg-purple-200 px-3 py-1 rounded-full border border-purple-400">
          <h2 className="text-md font-semibold flex items-center justify-center gap-2 text-secondary-text">
            <Brain />
            נומרו - העוזר החכם שלך
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-0">
        {!currentQuestion ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            אין תרגיל פעיל.
            <br />
            <span className="text-xs">בחרו תרגיל מהתפריט או התחילו חדש!</span>
          </div>
        ) : (
          <div className="space-y-1">
            <MathJax dynamic hideUntilTypeset="every" key={currentQuestion.id}>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {currentQuestion.question}
                </p>
              </div>
            </MathJax>
          </div>
        )}
      </div>
    </div>
  );
});

QuestionsPanel.displayName = "QuestionsPanel";

export default QuestionsPanel;

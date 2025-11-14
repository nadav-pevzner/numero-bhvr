import Sparkle from "../svgs/sparkle";

type MessageRole = "user" | "assistant";

type MessageProps = {
  role: MessageRole;
  content: string;
  onNodeRef?: (el: HTMLDivElement | null) => void;
};

export function Message({ role, content, onNodeRef }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      ref={onNodeRef}
      className={`flex gap-2 ${isUser ? "ui:justify-start" : "ui:justify-start"}`}
    >
      <div
        className={`ui:max-w-2xl ui:px-4 ui:py-3 ui:whitespace-pre-wrap ui:rounded-2xl ${
          !isUser
            ? "ui:bg-gray-200 ui:text-black ui:rounded-tl-none ui:border ui:border-gray-400"
            : "ui:bg-purple-200 ui:border ui:border-purple-400 ui:rounded-tr-none ui:text-black"
        }`}
      >
        {content}
      </div>
      {!isUser && (
        <div>
          <Sparkle />
        </div>
      )}
    </div>
  );
}

export default Message;

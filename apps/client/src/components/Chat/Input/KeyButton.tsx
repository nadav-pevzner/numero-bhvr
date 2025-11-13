import type { KeyboardKey } from "@/types";

export const KeyButton: React.FC<{
  k: KeyboardKey;
  tooltip?: string;
  onClick: () => void;
}> = ({ k, tooltip, onClick }) => {
  const base =
    "select-none rounded-lg border flex items-center justify-center text-center px-2 py-2 text-base transition";
  const w = k.width ? `basis-[calc(${k.width}*2.8rem)]` : "basis-[2.8rem]";
  const html = typeof k.display === "string" ? undefined : k.display;
  const displayText = k.label || (typeof k.display === "string" ? k.display : undefined);
  return (
    <button
      type="button"
      title={tooltip}
      onClick={onClick}
      className={`${base} ${w} border-slate-200 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm ${k.className || ""}`}
    >
      {k.render ? (
        <span className="w-full h-5 inline-flex items-center justify-center">{k.render}</span>
      ) : html ? (
        <span className="w-full">{html}</span>
      ) : displayText ? (
        <span className="w-full">{displayText}</span>
      ) : (
        <span className="w-full">{k.value}</span>
      )}
    </button>
  );
};

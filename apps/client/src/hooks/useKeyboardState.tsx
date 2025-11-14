import { serializeContentNodes } from "@/lib/latex";
import { useKeyboardStore } from "@/store/keyboardStore";
import { useEffect, useMemo, useRef } from "react";

export const useKeyboardState = (value: string, onChange: (value: string) => void) => {
  const {
    content,
    setContent,
    cursorPosition,
    setCursorPosition,
    activeTab,
    setActiveTab,
    activePlaceholder,
    setActivePlaceholder,
    isKeyboardOpen,
    setIsKeyboardOpen,
    isDragActive,
    setIsDragActive,
  } = useKeyboardStore();

  const lastSerializedRef = useRef("");

  const serialized = useMemo(() => serializeContentNodes(content), [content]);
  const isTextEmpty = serialized.trim().length === 0;

  const totalLength = useMemo(
    () =>
      content.reduce((sum, item) => {
        if (item.type === "text") return sum + item.value.length;
        return sum + 1;
      }, 0),
    [content],
  );

  // Sync serialized content with onChange
  useEffect(() => {
    if (serialized !== lastSerializedRef.current) {
      lastSerializedRef.current = serialized;
      onChange(serialized);
    }
  }, [serialized, onChange]);

  // Sync external value changes
  useEffect(() => {
    if (value !== lastSerializedRef.current) {
      lastSerializedRef.current = value;
      setContent(value ? [{ type: "text", value }] : [{ type: "text", value: "" }]);
      setCursorPosition(value.length);
      setActivePlaceholder(null);
    }
  }, [value, setContent, setCursorPosition, setActivePlaceholder]);

  return {
    content,
    setContent,
    cursorPosition,
    setCursorPosition,
    activeTab,
    setActiveTab,
    activePlaceholder,
    setActivePlaceholder,
    isKeyboardOpen,
    setIsKeyboardOpen,
    isDragActive,
    setIsDragActive,
    serialized,
    isTextEmpty,
    totalLength,
  };
};

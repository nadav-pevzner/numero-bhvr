import { keyToLatex } from "@/components/Chat/Input/layouts";
import type { ContentNode, KeyboardKey, StructureNode, StructurePart, TextNode } from "@/types";
import type React from "react";
import { useCallback } from "react";

interface KeyboardState {
  content: ContentNode[];
  setContent: React.Dispatch<React.SetStateAction<ContentNode[]>>;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  activePlaceholder: {
    structureIndex: number;
    placeholderIndex: number;
  } | null;
  setActivePlaceholder: React.Dispatch<
    React.SetStateAction<{
      structureIndex: number;
      placeholderIndex: number;
    } | null>
  >;
  totalLength: number;
  setIsDragActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useKeyboardActions = (
  state: KeyboardState,
  inputRef: React.RefObject<HTMLDivElement | null>,
  onFilesAdded?: (files: File[]) => void | Promise<void>,
) => {
  const focusInput = useCallback(() => inputRef.current?.focus(), [inputRef]);

  const forwardFiles = useCallback(
    (files: FileList | File[]) => {
      if (!onFilesAdded) return;
      const fileArray = Array.from(files as ArrayLike<File>);
      if (fileArray.length === 0) return;
      void onFilesAdded(fileArray);
      focusInput();
    },
    [onFilesAdded, focusInput],
  );

  const insertRawText = useCallback(
    (text: string) => {
      state.setContent((prev) => {
        const newContent = [...prev];

        if (state.activePlaceholder) {
          const structure = newContent[state.activePlaceholder.structureIndex] as StructureNode;
          const ph = structure.parts.find(
            (p) =>
              p.type === "placeholder" && p.index === state.activePlaceholder?.placeholderIndex,
          ) as Extract<StructurePart, { type: "placeholder" }>;
          ph.content = ph.content || [];
          if (ph.content.length > 0 && ph.content[ph.content.length - 1].type === "text") {
            (ph.content[ph.content.length - 1] as TextNode).value += text;
          } else {
            ph.content.push({ type: "text", value: text });
          }
          return newContent;
        }

        let charCount = 0;
        for (let i = 0; i < newContent.length; i++) {
          const item = newContent[i];
          const itemLength = item.type === "text" ? item.value.length : 1;

          if (charCount + itemLength >= state.cursorPosition) {
            const posInItem = state.cursorPosition - charCount;
            if (item.type === "text") {
              newContent[i] = {
                ...item,
                value: item.value.slice(0, posInItem) + text + item.value.slice(posInItem),
              };
            } else {
              newContent.splice(i + 1, 0, { type: "text", value: text });
            }
            break;
          }
          charCount += itemLength;
        }
        return newContent;
      });
      state.setCursorPosition((p) => p + text.length);
      focusInput();
    },
    [state, focusInput],
  );

  const insertLaTeX = useCallback(
    (latex: string, hasPlaceholders = false) => {
      if (hasPlaceholders) {
        const parts: StructurePart[] = [];
        let current = "";
        let placeholderIndex = 0;

        for (let i = 0; i < latex.length; i++) {
          const ch = latex[i];
          if (ch === "@") {
            if (current) {
              parts.push({ type: "static", value: current });
              current = "";
            }
            parts.push({
              type: "placeholder",
              index: placeholderIndex,
              content: [],
            });
            placeholderIndex++;
          } else {
            current += ch;
          }
        }
        if (current) parts.push({ type: "static", value: current });

        state.setContent((prev) => {
          const newContent = [...prev];
          let charCount = 0;
          let insertIndex = 0;
          let insertPosition = 0;

          for (let i = 0; i < newContent.length; i++) {
            const item = newContent[i];
            const itemLength = item.type === "text" ? item.value.length : 1;
            if (charCount + itemLength >= state.cursorPosition) {
              insertIndex = i;
              insertPosition = state.cursorPosition - charCount;
              break;
            }
            charCount += itemLength;
            if (i === newContent.length - 1) {
              insertIndex = i;
              insertPosition = itemLength;
            }
          }

          const currentItem = newContent[insertIndex];
          const structNode: StructureNode = {
            type: "structure",
            parts,
            template: latex,
          };

          if (currentItem.type === "text") {
            const before = currentItem.value.slice(0, insertPosition);
            const after = currentItem.value.slice(insertPosition);
            const items: ContentNode[] = [];
            if (before) items.push({ type: "text", value: before });
            items.push(structNode);
            if (after) items.push({ type: "text", value: after });
            else items.push({ type: "text", value: "" });
            newContent.splice(insertIndex, 1, ...items);
            const structureIndex = before ? insertIndex + 1 : insertIndex;
            state.setActivePlaceholder({ structureIndex, placeholderIndex: 0 });
          } else {
            newContent.splice(insertIndex + 1, 0, structNode, {
              type: "text",
              value: "",
            });
            state.setActivePlaceholder({
              structureIndex: insertIndex + 1,
              placeholderIndex: 0,
            });
          }

          return newContent;
        });

        state.setCursorPosition(0);
      } else {
        state.setContent((prev) => {
          const newContent = [...prev];
          let charCount = 0;
          let insertIndex = 0;
          let insertPosition = 0;

          for (let i = 0; i < newContent.length; i++) {
            const item = newContent[i];
            const itemLength = item.type === "text" ? item.value.length : 1;
            if (charCount + itemLength >= state.cursorPosition) {
              insertIndex = i;
              insertPosition = state.cursorPosition - charCount;
              break;
            }
            charCount += itemLength;
            if (i === newContent.length - 1) {
              insertIndex = i;
              insertPosition = itemLength;
            }
          }

          if (state.activePlaceholder) {
            const structure = newContent[state.activePlaceholder.structureIndex] as StructureNode;
            const ph = structure.parts.find(
              (p) =>
                p.type === "placeholder" && p.index === state.activePlaceholder?.placeholderIndex,
            ) as Extract<StructurePart, { type: "placeholder" }>;
            ph.content = ph.content || [];
            ph.content.push({ type: "latex", value: latex });
            return newContent;
          }

          const currentItem = newContent[insertIndex];
          if (currentItem.type === "text") {
            const before = currentItem.value.slice(0, insertPosition);
            const after = currentItem.value.slice(insertPosition);
            const items: ContentNode[] = [];
            if (before) items.push({ type: "text", value: before });
            items.push({ type: "latex", value: latex });
            if (after) items.push({ type: "text", value: after });
            else items.push({ type: "text", value: "" });
            newContent.splice(insertIndex, 1, ...items);
          } else {
            newContent.splice(
              insertIndex + 1,
              0,
              { type: "latex", value: latex },
              { type: "text", value: "" },
            );
          }

          return newContent;
        });

        state.setCursorPosition((p) => p + 1);
      }
      focusInput();
    },
    [state, focusInput],
  );

  const navigateToPreviousPlaceholder = useCallback(() => {
    if (state.activePlaceholder && state.activePlaceholder.placeholderIndex > 0) {
      state.setActivePlaceholder({
        structureIndex: state.activePlaceholder.structureIndex,
        placeholderIndex: state.activePlaceholder.placeholderIndex - 1,
      });
    }
    focusInput();
  }, [state, focusInput]);

  const exitPlaceholderMode = useCallback(() => {
    if (state.activePlaceholder) {
      const idx = state.activePlaceholder.structureIndex;
      state.setActivePlaceholder(null);
      let pos = 0;
      for (let i = 0; i <= idx; i++) {
        const item = state.content[i];
        pos += item.type === "text" ? item.value.length : 1;
      }
      state.setCursorPosition(pos);
    }
    focusInput();
  }, [state, focusInput]);

  const navigateToNextPlaceholder = useCallback(() => {
    if (state.activePlaceholder) {
      const structure = state.content[state.activePlaceholder.structureIndex] as
        | StructureNode
        | undefined;
      if (structure && structure.type === "structure") {
        const placeholderCount = structure.parts.filter((p) => p.type === "placeholder").length;
        const nextPlaceholder = state.activePlaceholder.placeholderIndex + 1;

        if (nextPlaceholder < placeholderCount) {
          state.setActivePlaceholder({
            structureIndex: state.activePlaceholder.structureIndex,
            placeholderIndex: nextPlaceholder,
          });
        } else {
          exitPlaceholderMode();
        }
      }
    }
    focusInput();
  }, [state, focusInput, exitPlaceholderMode]);

  const enterStructure = useCallback(() => {
    if (state.activePlaceholder === null) {
      let charCount = 0;
      for (let i = 0; i < state.content.length; i++) {
        const item = state.content[i];
        const itemLength = item.type === "text" ? item.value.length : 1;

        if (item.type === "structure") {
          if (state.cursorPosition >= charCount && state.cursorPosition <= charCount + itemLength) {
            state.setActivePlaceholder({
              structureIndex: i,
              placeholderIndex: 0,
            });
            focusInput();
            return;
          }
        }
        charCount += itemLength;
      }

      charCount = 0;
      for (let i = 0; i < state.content.length; i++) {
        const item = state.content[i];
        const itemLength = item.type === "text" ? item.value.length : 1;

        if (item.type === "structure" && charCount >= state.cursorPosition) {
          state.setActivePlaceholder({
            structureIndex: i,
            placeholderIndex: 0,
          });
          focusInput();
          return;
        }
        charCount += itemLength;
      }

      for (let i = state.content.length - 1; i >= 0; i--) {
        if (state.content[i].type === "structure") {
          state.setActivePlaceholder({
            structureIndex: i,
            placeholderIndex: 0,
          });
          focusInput();
          return;
        }
      }
    }
    focusInput();
  }, [state, focusInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const isChar = e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (
        isChar ||
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Enter"
      ) {
        e.preventDefault();
      }

      if (e.key === "Tab" && !e.shiftKey) {
        navigateToNextPlaceholder();
        return;
      }
      if (e.key === "Tab" && e.shiftKey) {
        navigateToPreviousPlaceholder();
        return;
      }
      if (e.key === "Escape") {
        exitPlaceholderMode();
        return;
      }

      if (state.activePlaceholder) {
        if (e.key === "Backspace") {
          state.setContent((prev) => {
            const newContent = [...prev];
            const struct = newContent[state.activePlaceholder!.structureIndex] as StructureNode;
            const ph = struct.parts.find(
              (p) =>
                p.type === "placeholder" && p.index === state.activePlaceholder?.placeholderIndex,
            ) as Extract<StructurePart, { type: "placeholder" }>;

            if (ph.content && ph.content.length > 0) {
              const last = ph.content[ph.content.length - 1];
              if (last.type === "text" && last.value.length > 0) {
                last.value = last.value.slice(0, -1);
                if (last.value.length === 0) ph.content.pop();
              } else {
                ph.content.pop();
              }
            }
            return newContent;
          });
          return;
        }
        if (isChar) {
          insertRawText(e.key);
          return;
        }
        return;
      }

      if (e.key === "Backspace") {
        if (state.cursorPosition === 0) return;
        state.setContent((prev) => {
          const newContent = [...prev];
          let charCount = 0;
          for (let i = 0; i < newContent.length; i++) {
            const item = newContent[i];
            const itemLength = item.type === "text" ? item.value.length : 1;

            if (charCount + itemLength >= state.cursorPosition) {
              const posInItem = state.cursorPosition - charCount;
              if (item.type === "text") {
                if (posInItem > 0) {
                  newContent[i] = {
                    ...item,
                    value: item.value.slice(0, posInItem - 1) + item.value.slice(posInItem),
                  };
                } else if (i > 0) {
                  newContent.splice(i - 1, 1);
                }
              } else {
                newContent.splice(i, 1);
                if (!(i < newContent.length && newContent[i].type === "text")) {
                  newContent.splice(i, 0, { type: "text", value: "" });
                }
              }
              break;
            }
            charCount += itemLength;
          }
          return newContent.filter(
            (it) => !(it.type === "text" && it.value === "" && newContent.length > 1),
          );
        });
        state.setCursorPosition((p) => Math.max(0, p - 1));
        return;
      }

      if (isChar) {
        insertRawText(e.key);
        return;
      }

      if (e.key === "ArrowLeft") {
        state.setCursorPosition((p) => Math.max(0, p - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        state.setCursorPosition((p) => Math.min(state.totalLength, p + 1));
        return;
      }
      if (e.key === "Enter") {
        insertRawText("\n");
        return;
      }
    },
    [
      state,
      insertRawText,
      navigateToNextPlaceholder,
      navigateToPreviousPlaceholder,
      exitPlaceholderMode,
    ],
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const { clipboardData } = event;
      if (!clipboardData) return;
      if (clipboardData.files && clipboardData.files.length > 0) {
        event.preventDefault();
        forwardFiles(clipboardData.files);
        return;
      }
      const text = clipboardData.getData("text/plain");
      if (text) {
        event.preventDefault();
        insertRawText(text);
      }
    },
    [forwardFiles, insertRawText],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      state.setIsDragActive(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        forwardFiles(event.dataTransfer.files);
        return;
      }
      const text = event.dataTransfer.getData("text/plain");
      if (text) {
        insertRawText(text);
      }
    },
    [forwardFiles, insertRawText, state],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      state.setIsDragActive(true);
    },
    [state],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const related = event.relatedTarget as Node | null;
      if (related && event.currentTarget.contains(related)) {
        return;
      }
      state.setIsDragActive(false);
    },
    [state],
  );

  const handleStaticAction = useCallback(
    (val: string) => {
      switch (val) {
        case "מחק הכל":
          state.setContent([{ type: "text", value: "" }]);
          state.setCursorPosition(0);
          state.setActivePlaceholder(null);
          focusInput();
          return;
        case "⌫":
          handleKeyDown({
            key: "Backspace",
            preventDefault() {},
            stopPropagation() {},
            nativeEvent: {} as any,
          } as any);
          return;
        case "↑":
        case "↓":
          focusInput();
          return;
        case "←":
          state.setCursorPosition((p) => Math.max(0, p - 1));
          focusInput();
          return;
        case "→":
          state.setCursorPosition((p) => Math.min(state.totalLength, p + 1));
          focusInput();
          return;
        case " ":
          insertRawText(" ");
          return;
        case "\n":
          insertRawText("\n");
          return;
        default:
          insertRawText(val);
      }
    },
    [state, handleKeyDown, insertRawText, focusInput],
  );

  const handleKeyClick = useCallback(
    (key: KeyboardKey) => {
      const mapping = keyToLatex(key.value);
      if (mapping.insertText) {
        insertRawText(mapping.insertText);
        return;
      }
      if (mapping.latex) {
        insertLaTeX(mapping.latex, !!mapping.placeholders);
        return;
      }
    },
    [insertRawText, insertLaTeX],
  );

  const renderStructureLatex = useCallback(
    (structure: StructureNode, structureIndex: number) => {
      let latex = "";
      for (const part of structure.parts) {
        if (part.type === "static") latex += part.value;
        else {
          const isActive =
            state.activePlaceholder &&
            state.activePlaceholder.structureIndex === structureIndex &&
            state.activePlaceholder.placeholderIndex === part.index;

          if (part.content && part.content.length > 0) {
            const phLatex = part.content
              .map((node) => (node.type === "text" ? node.value : node.value))
              .join("");
            latex += isActive ? `\\underline{${phLatex || "\\;"}}` : phLatex;
          } else {
            latex += isActive ? "\\underline{\\;\\;}" : "\\boxed{\\;}";
          }
        }
      }
      return latex;
    },
    [state.activePlaceholder],
  );

  return {
    insertRawText,
    insertLaTeX,
    handleKeyDown,
    handlePaste,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleStaticAction,
    handleKeyClick,
    navigateToPreviousPlaceholder,
    navigateToNextPlaceholder,
    exitPlaceholderMode,
    enterStructure,
    renderStructureLatex,
  };
};

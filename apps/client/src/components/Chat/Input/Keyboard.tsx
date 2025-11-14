import { useKeyboardActions } from "@/hooks/useKeyboardActions";
import { useKeyboardState } from "@/hooks/useKeyboardState";
import type { KeyboardProps } from "@/types";
import type React from "react";
import { useEffect, useRef } from "react";
import { EditorDisplay } from "./EditorDisplay";
import { KeyboardPanel } from "./KeyboardPanel";
import { StatusMessages } from "./StatusMessages";

const Keyboard: React.FC<KeyboardProps> = ({
  value,
  onChange,
  onSend,
  onUploadImage,
  onFilesAdded,
  isLoading,
  placeholder,
  hasAttachment = false,
  onRemoveAttachment,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const state = useKeyboardState(value, onChange);
  const actions = useKeyboardActions(state, inputRef, onFilesAdded);

  const isEmpty = !hasAttachment && state.isTextEmpty;

  const focusInput = () => inputRef.current?.focus();

  const toggleKeyboard = () =>
    state.setIsKeyboardOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setTimeout(() => focusInput(), 0);
      }
      return next;
    });

  const handleSendClick = () => {
    if (isEmpty || isLoading) return;
    onSend();
  };

  const handleStructureClick = (structureIndex: number) => {
    state.setActivePlaceholder({ structureIndex, placeholderIndex: 0 });
    focusInput();
  };

  // Auto-focus on mount
  useEffect(() => {
    focusInput();
  }, []);

  return (
    <div className="w-full mx-auto space-y-4">
      <EditorDisplay
        isTextEmpty={state.isTextEmpty}
        isEmpty={isEmpty}
        placeholder={placeholder}
        inputRef={inputRef}
        onKeyDown={actions.handleKeyDown}
        onPaste={actions.handlePaste}
        onDrop={actions.handleDrop}
        onDragOver={actions.handleDragOver}
        onDragEnter={actions.handleDragEnter}
        onDragLeave={actions.handleDragLeave}
        onFocusInput={focusInput}
        onToggleKeyboard={toggleKeyboard}
        onSendClick={handleSendClick}
        onUploadImage={onUploadImage}
        onRemoveAttachment={onRemoveAttachment}
        onStructureClick={handleStructureClick}
        renderStructureLatex={actions.renderStructureLatex}
      />

      <StatusMessages activePlaceholder={state.activePlaceholder} content={state.content} />

      {state.isKeyboardOpen && (
        <KeyboardPanel
          activeTab={state.activeTab}
          onTabChange={state.setActiveTab}
          onKeyClick={actions.handleKeyClick}
          onStaticAction={actions.handleStaticAction}
          onCursorMove={(direction) => {
            if (direction === "left") {
              state.setCursorPosition((p) => Math.max(0, p - 1));
            } else {
              state.setCursorPosition((p) => Math.min(state.totalLength, p + 1));
            }
            focusInput();
          }}
          onBackspace={() => {
            actions.handleKeyDown({
              key: "Backspace",
              preventDefault() {},
              stopPropagation() {},
              nativeEvent: {} as any,
            } as any);
          }}
          onSpace={() => actions.insertRawText(" ")}
          onEnterStructure={actions.enterStructure}
          onExitPlaceholder={actions.exitPlaceholderMode}
          onNextPlaceholder={actions.navigateToNextPlaceholder}
          onPrevPlaceholder={actions.navigateToPreviousPlaceholder}
          onClearAll={() => {
            state.setContent([{ type: "text", value: "" }]);
            state.setCursorPosition(0);
            state.setActivePlaceholder(null);
            focusInput();
          }}
          hasStructures={state.content.some((i) => i.type === "structure")}
          activePlaceholder={state.activePlaceholder}
          totalLength={state.totalLength}
        />
      )}
    </div>
  );
};

export default Keyboard;

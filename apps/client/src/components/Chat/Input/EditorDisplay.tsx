import { renderKatexToHTML } from "@/lib/latex";
import {
  useKeyboardActivePlaceholder,
  useKeyboardContent,
  useKeyboardCursorPosition,
  useKeyboardIsDragActive,
  useKeyboardIsOpen,
} from "@/store/keyboardStore";
import { usePendingImage } from "@/store/uiStore";
import type { StructureNode as StructureNodeType } from "@/types";
import { Button } from "@numero/ui/Button";
import { Image as ImageIcon } from "lucide-react";
import type React from "react";
import { memo, useLayoutEffect, useMemo, useRef } from "react";

interface EditorDisplayProps {
  isTextEmpty: boolean;
  isEmpty: boolean;
  placeholder?: string;
  inputRef: React.RefObject<HTMLDivElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onFocusInput: () => void;
  onToggleKeyboard: () => void;
  onSendClick: () => void;
  onUploadImage?: () => void;
  onRemoveAttachment?: () => void;
  onStructureClick: (structureIndex: number) => void;
  renderStructureLatex: (structure: StructureNodeType, structureIndex: number) => string;
}

// Memoized text node component
const TextNode = memo<{ char: string; index: number }>(({ char }) => (
  <span className="whitespace-pre-wrap">{char}</span>
));
TextNode.displayName = "TextNode";

const StructureNode = memo<{
  item: StructureNodeType;
  index: number;
  isActive: boolean;
  html: string;
  onClick: () => void;
}>(({ isActive, html, onClick }) => (
  <button
    type="button"
    className={`inline-block px-1.5 py-0.5 rounded-md border cursor-pointer transition-all ${
      isActive
        ? "border-amber-400 bg-amber-50 shadow-[0_0_0_3px_rgba(251,191,36,0.15)]"
        : "border-indigo-100 bg-indigo-50 hover:border-indigo-200"
    }`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    title="עריכת המבנה"
    dangerouslySetInnerHTML={{ __html: html }}
  />
));
StructureNode.displayName = "StructureNode";

// Memoized latex node component
const LatexNode = memo<{ html: string }>(({ html }) => (
  <span className="text-blue-600 font-medium" dangerouslySetInnerHTML={{ __html: html }} />
));
LatexNode.displayName = "LatexNode";

// Attachment preview component
const AttachmentPreview = memo<{
  previewUrl?: string;
  name?: string;
  onRemove?: () => void;
  isLoading: boolean;
}>(({ previewUrl, name, onRemove, isLoading }) => (
  <div className="mt-2 flex items-center gap-1 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-1 self-start">
    {previewUrl && (
      <img
        src={previewUrl}
        alt={name ?? "תמונה מצורפת"}
        className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
      />
    )}
    {onRemove && (
      <Button type="button" onClick={onRemove} disabled={isLoading}>
        הסרה
      </Button>
    )}
  </div>
));
AttachmentPreview.displayName = "AttachmentPreview";

export const EditorDisplay = memo<EditorDisplayProps>(
  ({
    isTextEmpty,
    isEmpty,
    placeholder,
    inputRef,
    onKeyDown,
    onPaste,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onFocusInput,
    onToggleKeyboard,
    onSendClick,
    onUploadImage,
    onRemoveAttachment,
    onStructureClick,
    renderStructureLatex,
  }) => {
    const content = useKeyboardContent();
    const cursorPosition = useKeyboardCursorPosition();
    const activePlaceholder = useKeyboardActivePlaceholder();
    const isKeyboardOpen = useKeyboardIsOpen();
    const isDragActive = useKeyboardIsDragActive();
    const pendingImage = usePendingImage();

    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (hiddenInputRef.current && activePlaceholder === null) {
        hiddenInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, [cursorPosition, activePlaceholder]);

    const renderedContent = useMemo(() => {
      const els: React.ReactNode[] = [];
      let charCount = 0;

      content.forEach((item, idx) => {
        if (item.type === "text") {
          // Split text into characters but memoize each one
          const chars = item.value.split("");
          chars.forEach((ch) => {
            const key = `t-${charCount}`;
            els.push(<TextNode key={key} char={ch} index={charCount} />);
            charCount++;
          });
        } else if (item.type === "structure") {
          const html = renderKatexToHTML(renderStructureLatex(item, idx));
          const isActive = activePlaceholder && activePlaceholder.structureIndex === idx;

          els.push(
            <StructureNode
              key={`s-${idx}`}
              item={item}
              index={idx}
              isActive={!!isActive}
              html={html}
              onClick={() => onStructureClick(idx)}
            />,
          );
          charCount++;
        } else {
          // latex node
          const html = renderKatexToHTML(item.value);
          els.push(<LatexNode key={`l-${charCount}`} html={html} />);
          charCount++;
        }
      });

      return els;
    }, [content, activePlaceholder, renderStructureLatex, onStructureClick]);

    const hasAttachment = !!pendingImage;

    return (
      <div className="border border-primary rounded-4xl bg-white">
        <div className="px-2 space-y-2">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              {/* Drag overlay */}
              <div
                className={`absolute inset-0 rounded-3xl border-2 border-dashed transition-all pointer-events-none ${
                  isDragActive ? "border-indigo-400 bg-indigo-50/40" : "border-transparent"
                }`}
              />

              {/* Placeholder */}
              {isTextEmpty && (
                <span className="pointer-events-none absolute inset-x-3 top-3 text-base text-slate-400">
                  {placeholder}
                </span>
              )}

              {/* Content editor */}
              {/** biome-ignore lint/a11y/useSemanticElements: for div-editor combo*/}
              <div
                ref={inputRef}
                tabIndex={0}
                role="textbox"
                aria-multiline="true"
                onKeyDown={onKeyDown}
                onPaste={onPaste}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onClick={onFocusInput}
                className="min-h-20 max-h-[260px] overflow-y-auto p-3 text-[1.15rem] leading-7 font-serif focus:outline-none ring-0 shadow-none relative"
              >
                {/* Hidden input for native cursor */}
                <input
                  ref={hiddenInputRef}
                  type="text"
                  className="absolute opacity-0 pointer-events-none"
                  aria-hidden="true"
                  tabIndex={-1}
                />

                {/* Content wrapper with cursor caret */}
                <div
                  ref={contentWrapperRef}
                  className="relative"
                  style={{ caretColor: activePlaceholder ? "transparent" : "rgb(99 102 241)" }}
                >
                  {renderedContent}
                </div>
              </div>

              {/* Attachment preview */}
              {hasAttachment && (
                <AttachmentPreview
                  previewUrl={pendingImage.previewUrl}
                  name={pendingImage.name}
                  onRemove={onRemoveAttachment}
                  isLoading={false}
                />
              )}
            </div>

            <div className="flex flex-row gap-1 shrink-0 justify-center items-center">
              {onUploadImage && (
                <Button onClick={onUploadImage} variant="icon" aria-label="העלאת תמונה">
                  <ImageIcon className="h-6 w-6" />
                </Button>
              )}
              <Button
                type="button"
                onClick={onToggleKeyboard}
                aria-pressed={isKeyboardOpen}
                aria-label={isKeyboardOpen ? "סגירת מקלדת" : "פתיחת מקלדת"}
                variant="secondary"
              >
                {isKeyboardOpen ? "סגירה" : "פתח מקלדת"}
              </Button>
              <Button onClick={onSendClick} disabled={isEmpty} aria-label="שליחת הודעה">
                שליחה
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

EditorDisplay.displayName = "EditorDisplay";

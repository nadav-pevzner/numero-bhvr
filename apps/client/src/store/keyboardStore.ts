import type { ContentNode, KeyboardType } from "@/types";
import { create } from "zustand";

// Minimal keyboard state - only what MUST be global
interface KeyboardState {
  content: ContentNode[];
  cursorPosition: number;
  activeTab: KeyboardType;
  activePlaceholder: {
    structureIndex: number;
    placeholderIndex: number;
  } | null;
  isKeyboardOpen: boolean;
  isDragActive: boolean;
}

interface KeyboardActions {
  setContent: (content: ContentNode[] | ((prev: ContentNode[]) => ContentNode[])) => void;
  setCursorPosition: (position: number | ((prev: number) => number)) => void;
  setActiveTab: (tab: KeyboardType) => void;
  setActivePlaceholder: (
    placeholder:
      | KeyboardState["activePlaceholder"]
      | ((prev: KeyboardState["activePlaceholder"]) => KeyboardState["activePlaceholder"]),
  ) => void;
  setIsKeyboardOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsDragActive: (active: boolean) => void;
  reset: () => void;
}

const initialState: KeyboardState = {
  content: [{ type: "text", value: "" }],
  cursorPosition: 0,
  activeTab: "basic",
  activePlaceholder: null,
  isKeyboardOpen: false,
  isDragActive: false,
};

export const useKeyboardStore = create<KeyboardState & KeyboardActions>((set) => ({
  ...initialState,

  setContent: (content) =>
    set((state) => ({
      content: typeof content === "function" ? content(state.content) : content,
    })),

  setCursorPosition: (position) =>
    set((state) => ({
      cursorPosition: typeof position === "function" ? position(state.cursorPosition) : position,
    })),

  setActiveTab: (activeTab) => set({ activeTab }),

  setActivePlaceholder: (placeholder) =>
    set((state) => ({
      activePlaceholder:
        typeof placeholder === "function" ? placeholder(state.activePlaceholder) : placeholder,
    })),

  setIsKeyboardOpen: (open) =>
    set((state) => ({
      isKeyboardOpen: typeof open === "function" ? open(state.isKeyboardOpen) : open,
    })),

  setIsDragActive: (isDragActive) => set({ isDragActive }),

  reset: () => set(initialState),
}));

// Selectors - direct access pattern
export const useKeyboardContent = () => useKeyboardStore((state) => state.content);
export const useKeyboardCursorPosition = () => useKeyboardStore((state) => state.cursorPosition);
export const useKeyboardActiveTab = () => useKeyboardStore((state) => state.activeTab);
export const useKeyboardActivePlaceholder = () =>
  useKeyboardStore((state) => state.activePlaceholder);
export const useKeyboardIsOpen = () => useKeyboardStore((state) => state.isKeyboardOpen);
export const useKeyboardIsDragActive = () => useKeyboardStore((state) => state.isDragActive);

// Actions selector for components that need multiple actions
export const useKeyboardActions = () =>
  useKeyboardStore((state) => ({
    setContent: state.setContent,
    setCursorPosition: state.setCursorPosition,
    setActiveTab: state.setActiveTab,
    setActivePlaceholder: state.setActivePlaceholder,
    setIsKeyboardOpen: state.setIsKeyboardOpen,
    setIsDragActive: state.setIsDragActive,
    reset: state.reset,
  }));

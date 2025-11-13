import type { ContentNode } from "@/types";
import { create } from "zustand";

interface UiState {
  inputMessage: string;
  pendingImage: {
    base64Data: string;
    mimeType: string;
    previewUrl: string;
    name: string;
  } | null;

  currentConversationId: number | null;
  currentQuestionId: number | null;

  editingConversationId: number | null;
  editingName: string;
}

interface UiActions {
  setInputMessage: (message: string | ContentNode[]) => void;
  clearInputMessage: () => void;

  setPendingImage: (image: UiState["pendingImage"]) => void;
  clearPendingImage: () => void;

  setCurrentConversation: (id: number | null) => void;
  setCurrentQuestion: (id: number | null) => void;

  startEditingConversation: (id: number, name: string) => void;
  cancelEditingConversation: () => void;
  updateEditingName: (name: string) => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  inputMessage: "",
  pendingImage: null,
  currentConversationId: null,
  currentQuestionId: null,
  editingConversationId: null,
  editingName: "",

  // Actions
  setInputMessage: (message) =>
    set({
      inputMessage: typeof message === "string" ? message : JSON.stringify(message),
    }),

  clearInputMessage: () => set({ inputMessage: "" }),

  setPendingImage: (pendingImage) => set({ pendingImage }),

  clearPendingImage: () => set({ pendingImage: null }),

  setCurrentConversation: (currentConversationId) =>
    set({
      currentConversationId,
      currentQuestionId: null,
    }),

  setCurrentQuestion: (currentQuestionId) => set({ currentQuestionId }),

  startEditingConversation: (id, name) =>
    set({
      editingConversationId: id,
      editingName: name,
    }),

  cancelEditingConversation: () =>
    set({
      editingConversationId: null,
      editingName: "",
    }),

  updateEditingName: (editingName) => set({ editingName }),
}));

export const useInputMessage = () => useUiStore((state) => state.inputMessage);
export const usePendingImage = () => useUiStore((state) => state.pendingImage);
export const useCurrentConversationId = () => useUiStore((state) => state.currentConversationId);
export const useCurrentQuestionId = () => useUiStore((state) => state.currentQuestionId);
export const useEditingConversation = () =>
  useUiStore((state) => ({
    id: state.editingConversationId,
    name: state.editingName,
  }));

export const useUiActions = () =>
  useUiStore((state) => ({
    setInputMessage: state.setInputMessage,
    clearInputMessage: state.clearInputMessage,
    setPendingImage: state.setPendingImage,
    clearPendingImage: state.clearPendingImage,
    setCurrentConversation: state.setCurrentConversation,
    setCurrentQuestion: state.setCurrentQuestion,
    startEditingConversation: state.startEditingConversation,
    cancelEditingConversation: state.cancelEditingConversation,
    updateEditingName: state.updateEditingName,
  }));

// hooks/useConversations.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ConversationWithQuestions, QuestionResponse } from "../types";

const CONVERSATIONS_KEY = ["conversations"] as const;

export function useConversations() {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: async () => {
      const resp = await apiClient.api.chats.conversations.$get();
      if (!resp.ok) throw new Error("Failed to fetch conversations");
      const conversations = await resp.json();

      if (conversations.length === 0) {
        const initResp = await apiClient.api.chats.conversations.initialize.$post();
        if (!initResp.ok) throw new Error("Failed to initialize conversations");
        return [await initResp.json()];
      }

      return conversations;
    },
  });

  // Create
  const createConversationMutation = useMutation({
    mutationFn: async (name?: string) => {
      const resp = await apiClient.api.chats.conversations.$post({
        json: { name: name ?? "שיחה חדשה" },
      });
      if (!resp.ok) throw new Error("Failed to create conversation");
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  // Delete
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      const resp = await apiClient.api.chats.conversations[":id"].$delete({
        param: { id: id.toString() },
      });
      if (!resp.ok) throw new Error("Failed to delete conversation");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  // Rename
  const updateConversationNameMutation = useMutation({
    mutationFn: async (params: { id: number; name: string }) => {
      const resp = await apiClient.api.chats.conversations[":id"].$patch({
        param: { id: params.id.toString() },
        json: { name: params.name.trim() },
      });
      if (!resp.ok) throw new Error("Failed to update conversation name");
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  const addQuestionLocal = (conversationId: number, question: QuestionResponse) => {
    queryClient.setQueryData<ConversationWithQuestions[]>(CONVERSATIONS_KEY, (prev) => {
      if (!prev) return prev;
      return prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, questions: [...(conv.questions || []), question] }
          : conv,
      );
    });
  };

  const updateQuestionsLocal = (
    conversationId: number,
    updater: (prev: QuestionResponse[]) => QuestionResponse[],
  ) => {
    queryClient.setQueryData<ConversationWithQuestions[]>(CONVERSATIONS_KEY, (prev) => {
      if (!prev) return prev;
      return prev.map((conv) =>
        conv.id === conversationId ? { ...conv, questions: updater(conv.questions || []) } : conv,
      );
    });
  };

  return {
    ...conversationsQuery,
    createConversation: createConversationMutation.mutateAsync,
    deleteConversation: deleteConversationMutation.mutateAsync,
    updateConversationName: updateConversationNameMutation.mutateAsync,
    addQuestionLocal,
    updateQuestionsLocal,
    refetchConversations: conversationsQuery.refetch,
  };
}

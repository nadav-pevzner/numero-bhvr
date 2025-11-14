import type { Conversation, Message, Question } from "@numero/chat-db";

export type TextNode = { type: "text"; value: string };
export type LatexNode = { type: "latex"; value: string };
export type StructurePart =
  | { type: "static"; value: string }
  | { type: "placeholder"; index: number; content: (TextNode | LatexNode)[] };
export type StructureNode = {
  type: "structure";
  parts: StructurePart[];
  template: string;
};
export type ContentNode = TextNode | LatexNode | StructureNode;

export interface KeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onUploadImage: () => void;
  onFilesAdded?: (files: File[]) => void | Promise<void>;
  isLoading: boolean;
  placeholder: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentPreview?: string;
  onRemoveAttachment?: () => void;
}

export type KeyboardType =
  | "basic"
  | "geometry"
  | "hebrew"
  | "english"
  | "logic"
  | "differntial"
  | "others";

export type KeyboardKey = {
  value: string;
  display?: string | React.ReactNode;
  label?: string;
  width?: number; // relative width (1 = base)
  render?: React.ReactNode;
  className?: string;
};

export type KeyboardLayout = {
  label: string;
  rows: KeyboardKey[][];
};

// API response types - these represent what comes over the wire
// Dates are serialized as strings when sent from server to client

// Helper type to convert Date fields to strings for API responses
type Serialized<T> = {
	[K in keyof T]: T[K] extends Date
		? string
		: T[K] extends Date | null
			? string | null
			: T[K];
};

// API response types (dates as strings)
export type ConversationResponse = Serialized<Conversation>;
export type QuestionResponse = Serialized<Question>;
export type MessageResponse = Serialized<Message>;

// Extended types with relations for client-side use
export interface ConversationWithQuestions extends ConversationResponse {
	questions?: QuestionResponse[];
}

export interface QuestionWithMessages extends QuestionResponse {
	messages?: MessageResponse[];
}

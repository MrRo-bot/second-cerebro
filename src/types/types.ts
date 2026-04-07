import { Ref } from "react";
import { ExternalToast } from "sonner";

export type StatusType = "success" | "info" | "warning" | "error" | "loading";

export interface ToastEventType {
  message: string;
  status?: StatusType;
  description?: string;
  opts?: ExternalToast;
}

// Defining what the parent can "see" when tiptap component is used
export interface TiptapHandleType {
  clearContent: () => void;
  getMarkdown: () => string | undefined;
}

export interface TiptapPropsType {
  ref?: Ref<TiptapHandleType>;
  id: string;
  name: string;
  placeholder: string;
  initialContent?: string;
  onContentChange?: (markdown: string) => void;
}

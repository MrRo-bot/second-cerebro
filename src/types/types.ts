import { Ref } from "react";

export type StatusType = "success" | "info" | "warning" | "error" | "promise";

export interface ToastEvent {
  status: StatusType;
  message: string;
}

//* Defining what the parent can "see" when tiptap component is used
export interface TiptapHandle {
  clearContent: () => void;
  getMarkdown: () => string | undefined;
}

export interface TiptapPropsType {
  ref?: Ref<TiptapHandle>;
  id: string;
  name: string;
  placeholder: string;
  initialContent?: string;
  onContentChange?: (markdown: string) => void;
}

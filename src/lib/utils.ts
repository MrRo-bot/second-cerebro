import { ToastEvent } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const renderToast = ({
  status = "info",
  message,
  description,
  opts,
}: ToastEvent) => {
  const toastFn = {
    success: toast.success,
    info: toast.info,
    warning: toast.warning,
    error: toast.error,
    loading: toast.loading,
  }[status];

  return toastFn(message, {
    description,
    ...opts, //* Spreading opts to set more opts like position, duration, etc.
  });
};

export const escapeRegex = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/*
 * Cleans markdown syntax for better embedding quality
 * Removes common markdown markers while keeping the actual text
 */
export const cleanMarkdownForEmbedding = (markdown: string): string => {
  return markdown
    .replace(/[#*`_~>|-]/g, " ") //* Remove markdown symbols
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") //* Convert [text](url) → text
    .replace(/!\[.*?\]\(.*?\)/g, "") //* Remove image markdown
    .replace(/\n+/g, " ") //* Normalize newlines
    .replace(/\s+/g, " ") //* Collapse whitespace
    .trim();
};

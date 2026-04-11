import { UAParser } from "ua-parser-js";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { ToastEventType } from "@/types/types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const renderToast = ({
  status = "info",
  message,
  description,
  opts,
}: ToastEventType) => {
  const toastFn = {
    success: toast.success,
    info: toast.info,
    warning: toast.warning,
    error: toast.error,
    loading: toast.loading,
  }[status];

  return toastFn(message, {
    description,
    ...opts, // Spreading opts to set more opts like position, duration, etc.
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
    .replace(/[#*`_~>|-]/g, " ") // Remove markdown symbols
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Convert [text](url) → text
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove image markdown
    .replace(/\n+/g, " ") // Normalize newlines
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
};

// Inside map function
export const userAgentParser = (userAgent: string | null | undefined) => {
  if (!userAgent) {
    return "Unknown Device";
  }
  const parser = new UAParser(userAgent);
  const device = parser.getDevice(); // { type: 'mobile', model: 'iPhone', vendor: 'Apple' }
  const os = parser.getOS(); // { name: 'iOS', version: '15.0' }
  const browser = parser.getBrowser(); // { name: 'Safari', version: '15.0' }

  return device.type
    ? `${device.vendor} ${device.model} (${os.name})`
    : `${browser.name} on ${os.name}`;
};

export const getPromptForProcessing = (title: string, content: string) => `
    You are an expert content curator, Summarize the following document titled: "${title}", and content: ${content}.
    Summarize the following content in clear, concise bullet points, using only <h2>, <p>, <ul>, <blockquote>, <pre>, <b>, <i>, <u> and <li> tags. Keep it under 300 words, Include key insights and actionable takeaways.
`;

export const getPromptForTags = (
  title: string,
  content: string,
) => `You are an expert at creating concise tags.
Generate 3 to 5 relevant tags for the following note.
Return ONLY a valid JSON array of strings. Do not include any explanation.

Title: ${title}
Content: ${content}

Example output: ["scooty", 'body work', "maintenance", "repair", "oil-check"]`;

export const capitalizeTag = (tag: string): string => {
  return tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1).toLowerCase();
};

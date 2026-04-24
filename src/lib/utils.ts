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
  You are an expert content curator. Summarize the following document titled: "${title}".
  
  Format the summary using standard Markdown:
  - Use ## for headers
  - Use * or - for bullet points
  - Use **bold** for emphasis
  - Use > for quotes
  
  Keep it under 300 words and focus on actionable takeaways.
  
  Content: ${content}
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

export const buildSystemPrompt = (context: string) => `
  You are a Second Brain assistant.
  Use the follwing context to answer:
  ---
  ${context || "No relevant notes found"}
  ---
`;

export const capitalizeTag = (tag: string): string => {
  return tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1).toLowerCase();
};

// calculates cosine similarity between two vectors
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const copyToClipboard = (text: string | undefined | null) => {
  if (text) {
    navigator.clipboard.writeText(text);
    renderToast({ status: "success", message: "Copied to clipboard" });
  } else {
    renderToast({ status: "warning", message: "Content can't be copied" });
  }
};

export const promptSuggestions = [
  "Summarize my react notes",
  "Find notes related to travel",
  "Recent project updates",
  "What are my goals for this week?",
  "Clear Chat",
];

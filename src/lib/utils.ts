import { UAParser } from "ua-parser-js";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { ErrorLike, ToastEventType } from "@/types/types";

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

export const CHARS_PER_TOKEN = 3;

export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / CHARS_PER_TOKEN);

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
Return ONLY a valid JSON object with a single "tags" key containing an array of strings. Do not include any explanation.

Title: ${title}
Content: ${content}

Example output: {"tags": ["scooty", "body work", "maintenance", "repair", "oil-check"]}`;

export const buildSystemPrompt = (context: string) => `
  You are a Second Brain assistant.
  Use the following context to answer:
  ---
  ${context || "No relevant notes found"}
  ---
`;

/*
 * Truncates a single string so prompt + completion + overhead fit the TPM limit.
 * Used by the summarizers.
 */
export const enforceTokenBudget = (
  text: string,
  opts: {
    tpmLimit?: number;
    maxCompletionTokens?: number;
    promptOverheadTokens?: number;
  } = {},
): string => {
  const {
    tpmLimit = 8000,
    maxCompletionTokens = 1000,
    promptOverheadTokens = 500,
  } = opts;

  const maxInputChars =
    (tpmLimit - maxCompletionTokens - promptOverheadTokens) * CHARS_PER_TOKEN;

  return text.substring(0, Math.max(maxInputChars, 0));
};

/*
 * Greedy fill in rank order: best-matching notes get budget first,
 * the tail is dropped, and no single note can starve the rest.
 */
export const buildContextWithinBudget = (
  notes: { title: string; content: string }[],
  maxContextTokens: number,
  perNoteCapTokens = 500,
): string => {
  const parts: string[] = [];
  let used = 0;

  for (const doc of notes) {
    // Tiptap content is often HTML; strip tags to save tokens
    const text = (doc.content ?? "").replace(/<[^>]*>?/gm, "").trim();
    if (!text) continue;

    const header = `[Title: ${doc.title}]\n`;
    const remaining = maxContextTokens - used - estimateTokens(header);
    if (remaining < 50) break;

    const allowedChars = Math.min(perNoteCapTokens, remaining) * CHARS_PER_TOKEN;
    const chunk = header + text.slice(0, allowedChars);

    parts.push(chunk);
    used += estimateTokens(chunk) + 1; // +1 for the separator
  }

  return parts.join("\n\n");
};

export const capitalizeTag = (tag: string): string => {
  return tag
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
];

export const quoteCategories = [
  ["success", "ambition", "determination", "leadership"],
  ["wellness", "health", "finance", "consistency"],
  ["learning", "curiosity", "art", "technology", "nature"],
  ["wisdom", "experience", "reflection"],
  ["philosophy", "truth", "logic", "ethics"],
  ["science", "innovation", "future", "computers", "intelligence"],
  ["creativity", "imagination", "poetry", "design"],
  ["psychology", "behavior", "relationships", "society"],
  ["knowledge", "learning", "mind", "memory", "intelligence"],
  ["courage", "failure", "perspective", "change"],
  ["inspirational", "motivational", "wisdom", "self-help"],
];



export const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    const e = error as ErrorLike;
    const cause = e.cause as ErrorLike | undefined;
    return {
      name: e.name,
      message: e.body?.message ?? e.message,
      status: e.statusCode ?? e.status ?? cause?.statusCode ?? cause?.status,
      cause: cause?.message,
    };
  }
  return { name: "UnknownError", message: String(error) };
};

export const runUpdate = async <T extends { error: unknown }>(
  action: () => Promise<T>,
  { success, fallback }: { success: string; fallback: string }
) => {
  try {
    const { error } = await action();
    if (error) throw error; // route API errors through the same path
    renderToast({ status: "success", message: success });
    return true;
  } catch (err) {
    console.error(fallback, err);
    const info = normalizeError(err);
    renderToast({
      status: "error" as const,
      message: info.message || fallback,
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    });
    return false;
  }
};
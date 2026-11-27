"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createStreamableValue } from "@ai-sdk/rsc";

import {
  groqClient,
  parseLocalFile,
  parseTranscript,
  parseWebPage,
  semanticSearchQuery,
} from "@/lib/ai";
import { auth } from "@/lib/auth";
import {
  GROQ_CHAT_MODEL,
  MAX_FILE_SIZE,
  SUMMARY_CONFIG,
} from "@/lib/constants";
import {
  buildContextWithinBudget,
  buildSystemPrompt,
  enforceTokenBudget,
  estimateTokens,
  getPromptForProcessing,
  normalizeError,
} from "@/lib/utils";
import { fetchSafeWebPageHtml } from "@/lib/web-safe-parse";

import { addNoteAction } from "./note.action";

import { AIRagActionType, ContentType, SummaryActionType } from "@/types/ai";
import { NoteActionType, NoteType } from "@/types/note";

// ---- RAG token budget (Groq TPM limit covers prompt + completion) ----
const RAG_TPM_LIMIT = 8000;
const RAG_COMPLETION_TOKENS = 1200;
const RAG_SYSTEM_OVERHEAD_TOKENS = 150; // system prompt wrapper + message framing
const RAG_HISTORY_MESSAGES = 6;
const RAG_MAX_PROMPT_CHARS = 2000;

// ---- summarizing helper ----
const summarizeContent = (
  contentType: ContentType,
  title: string,
  rawText: string,
) => {
  const config = SUMMARY_CONFIG[contentType];

  const cleanedText = enforceTokenBudget(rawText, {
    maxCompletionTokens: config.max_completion_tokens,
    promptOverheadTokens: config.promptOverheadTokens,
  });

  const prompt = getPromptForProcessing(title, cleanedText);

  return groqClient.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: GROQ_CHAT_MODEL,
    temperature: config.temperature,
    reasoning_effort: config.reasoning_effort,
    max_completion_tokens: config.max_completion_tokens,
  });
};

// Shared: save a summary as a note and return its id (or an error result)
const saveSummaryAsNote = async (
  title: string,
  summary: string,
  type: string,
): Promise<{ noteId: string } | { error: SummaryActionType }> => {
  const noteFormData = new FormData();
  noteFormData.append("title", title);
  noteFormData.append("content", summary);
  noteFormData.append("type", type);

  const result = await addNoteAction({} as NoteActionType, noteFormData);

  if (result.status === "success" && result.newNoteId) {
    return { noteId: result.newNoteId };
  }

  console.error("Failed to save note: ", result.message);
  return {
    error: {
      status: "error",
      message: result.message || "Summary created but failed to save note",
    },
  };
};

/*
 * AI RAG action:
 * gets formData, preserves chat history
 * authenticates, retrieves relevant notes
 * builds context within the token budget (history + prompt + completion reserved)
 * streams the Groq response; errors inside the stream surface via stream.error
 */
export const AIRagAction = async (
  state: AIRagActionType,
  formData: FormData,
): Promise<AIRagActionType> => {
  const currentHistory = state?.response || [];

  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session?.user?.id) {
    return {
      status: "error" as const,
      message: "Unauthorized",
      response: currentHistory,
    };
  }

  // Clear conversation
  if (formData.get("clear") === "true") {
    return { status: "success" as const, message: "Success", response: [] };
  }

  const prompt = formData
    .get("prompt")
    ?.toString()
    .trim()
    .slice(0, RAG_MAX_PROMPT_CHARS);

  if (!prompt) {
    return {
      status: "warning" as const,
      message: "Prompt is required",
      response: currentHistory,
    };
  }

  try {
    const userId = new ObjectId(session.user.id);
    const notesList = await semanticSearchQuery(prompt, userId, 10, 100);

    // Streamed assistant messages are StreamableValue objects, not strings
    const sanitizedHistory = currentHistory
      .map((msg) => ({
        role: msg.role,
        content:
          typeof msg.content === "string" ? msg.content : "[Streaming Content]",
      }))
      .slice(-RAG_HISTORY_MESSAGES);

    const historyTokens = sanitizedHistory.reduce(
      (total, msg) => total + estimateTokens(msg.content),
      0,
    );

    const contextBudget = Math.max(
      RAG_TPM_LIMIT -
        RAG_COMPLETION_TOKENS -
        RAG_SYSTEM_OVERHEAD_TOKENS -
        historyTokens -
        estimateTokens(prompt),
      0,
    );

    const context = buildContextWithinBudget(
      notesList as NoteType[],
      contextBudget,
    );

    const stream = createStreamableValue("");

    // Fire-and-forget: the action returns the stream immediately.
    // try/catch MUST live inside, otherwise rejections are never caught.
    void (async () => {
      try {
        const rawStream = await groqClient.chat.completions.create({
          messages: [
            { role: "system", content: buildSystemPrompt(context) },
            ...sanitizedHistory,
            { role: "user", content: prompt },
          ],
          model: GROQ_CHAT_MODEL,
          stream: true,
          max_completion_tokens: RAG_COMPLETION_TOKENS,
          temperature: 0.6,
          reasoning_effort: "low",
        });

        let fullContent = "";
        for await (const chunk of rawStream) {
          fullContent += chunk.choices[0]?.delta?.content || "";
          stream.update(fullContent);
        }
        stream.done();
      } catch (error) {
        console.error("CHAT_STREAM_ERROR: ", error);
        const info = normalizeError(error);
        stream.error(new Error(info.message || "Chat stream failed"));
      }
    })();

    return {
      status: "success" as const,
      message: "Success",
      response: [
        ...currentHistory,
        { role: "user", content: prompt },
        { role: "assistant", content: stream.value },
      ],
    };
  } catch (error) {
    console.error("RAG_ACTION_ERROR: ", error);
    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Chat failed",
      response: currentHistory,
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
};

/*
 * AI Web Summary action:
 * SSRF-safe fetch -> parse -> summarize -> save note -> redirect
 */
export const WebSummaryAction = async (
  state: SummaryActionType,
  formData: FormData,
): Promise<SummaryActionType> => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session?.user?.id) {
    return {
      status: "error" as const,
      message: "Unauthorized",
    };
  }

  const url = formData.get("webUrl")?.toString().trim();
  if (!url) return { status: "warning", message: "URL is required" };

  let fetchedPage: { finalUrl: string; html: string };
  try {
    fetchedPage = await fetchSafeWebPageHtml(url);
  } catch (error) {
    const info = normalizeError(error);
    return {
      status: "error",
      message: info.message || "Invalid or blocked URL",
    };
  }

  const parseResult = await parseWebPage(
    fetchedPage.finalUrl,
    fetchedPage.html,
  );

  if (parseResult.status === "error" || !parseResult.response) {
    return {
      status: "error",
      message: parseResult.message || "Web page parsing failed",
    };
  }

  const { title, content, plainText, type } = parseResult.response;

  if (!title || !content || !plainText) {
    return { status: "error", message: "Web page parsing response error" };
  }

  let noteId: string;

  try {
    const summaryObject = await summarizeContent(type, title, plainText);
    const summary = summaryObject.choices[0]?.message?.content?.trim();

    if (!summary) {
      return {
        status: "error",
        message: "Summary generation returned no content",
      };
    }

    const saved = await saveSummaryAsNote(title, summary, type);
    if ("error" in saved) return saved.error;
    noteId = saved.noteId;
  } catch (error) {
    console.error("SUMMARY_ERROR: ", error);
    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to generate summary or save a note",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }

  redirect(`/dashboard/${noteId}`);
};

/*
 * AI File Summary action:
 * validate file -> parse -> strip markup -> summarize -> save note -> redirect
 */
const decodeHtmlEntities = (value: string): string =>
  value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");

export const FileSummaryAction = async (
  state: SummaryActionType,
  formData: FormData,
): Promise<SummaryActionType> => {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "No file provided" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      status: "error",
      message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)}MB limit.`,
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session?.user?.id) {
    return {
      status: "error" as const,
      message: "Unauthorized",
    };
  }

  let noteId: string;

  try {
    const parsedFile = await parseLocalFile(file);

    if (parsedFile.status === "error" || !parsedFile.response) {
      return {
        status: "error",
        message: parsedFile.message || "Parsing failed",
      };
    }

    // Strip HTML tags and decode entities so tokens stay clean and preserve <, >, and &
    const withoutTags = parsedFile.response.content.replace(/<[^>]*>?/gm, "");
    const cleanedPlainText = decodeHtmlEntities(withoutTags).trim();

    if (!cleanedPlainText) {
      return {
        status: "error",
        message: "No extractable text found in file",
      };
    }

    const summaryObject = await summarizeContent(
      "file",
      parsedFile.response.title,
      cleanedPlainText,
    );

    const summary = summaryObject.choices[0]?.message?.content?.trim();

    if (!summary) {
      return {
        status: "error",
        message: "Summary generation returned no content",
      };
    }

    const saved = await saveSummaryAsNote(
      parsedFile.response.title,
      summary,
      parsedFile.response.type,
    );
    if ("error" in saved) return saved.error;
    noteId = saved.noteId;
  } catch (error) {
    console.error("FILE_PROCESS_ERROR: ", error);
    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to summarize a file",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }

  redirect(`/dashboard/${noteId}`);
};

/*
 * AI Transcript Summary action: ONLY DEVELOPMENT
 * get url -> fetch transcript -> summarize -> save note -> redirect
 */
export const TranscriptSummaryAction = async (
  state: SummaryActionType,
  formData: FormData,
): Promise<SummaryActionType> => {
  //todo: only because transcript cant work for free on production environment
  if (process.env.NODE_ENV === "development") {
    const session = await auth.api.getSession({
      headers: await headers(),
      query: { disableCookieCache: true },
    });

    if (!session?.user?.id) {
      return {
        status: "error" as const,
        message: "Unauthorized",
      };
    }

    const url = formData.get("youtubeUrl")?.toString().trim();
    if (!url) return { status: "error", message: "No URL provided" };

    let noteId: string;

    try {
      const transcript = await parseTranscript(url);

      if (!transcript.response) {
        throw new Error(transcript.message || "Transcript unavailable");
      }

      const { title, content, type } = transcript.response;

      const summaryObject = await summarizeContent("youtube", title, content);
      const summary = summaryObject.choices[0]?.message?.content?.trim();

      if (!summary) {
        return {
          status: "error",
          message: "Summary generation returned no content",
        };
      }

      const saved = await saveSummaryAsNote(title, summary, type);
      if ("error" in saved) return saved.error;
      noteId = saved.noteId;
    } catch (error) {
      console.error("TRANSCRIPT_PROCESS_ERROR: ", error);
      const info = normalizeError(error);

      return {
        status: "error" as const,
        message: info.message || "Failed to summarize the video",
        // ...(process.env.NODE_ENV !== "production" && { debug: info }),
      };
    }

    redirect(`/dashboard/${noteId}`);
  }
  else{
    return {status:'error' as const, message:'Transcript summarization is disabled in production'}
  }
};

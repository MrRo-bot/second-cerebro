"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { groqClient, semanticSearchQuery } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { parseWebPage } from "@/lib/ai";
import { parseLocalFile } from "@/lib/ai";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { getPromptForProcessing } from "@/lib/utils";

import { AIRagActionType, SummaryActionType } from "@/types/ai";

const buildSystemPrompt = (context: string) => `
  You are a Second Brain assistant.
  Use the follwing context to answer:
  ---
  ${context || "No relevant notes found"}
  ---
`;

/*
 * AI RAG action:
 * - gets formData
 * - preserves chat history
 * - finds session IF FAILS sends errors IF SUCCESS goto next
 * - creates context from relevant chosen data
 * - contacts groq and returns chat related data
 * - finds response data in chat related data IF FAILS sends error IF SUCCESS returns output for UI
 */
export const AIRagAction = async (
  state: AIRagActionType,
  formData: FormData,
): Promise<AIRagActionType> => {
  const prompt = formData.get("prompt")?.toString();
  const currentHistory = state?.response || [];

  if (!prompt)
    return {
      status: "warning" as const,
      message: "Prompt is required",
      response: currentHistory,
    };

  try {
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

    const userId = new ObjectId(session.user.id);

    const notesList = await semanticSearchQuery(prompt, userId, 10, 100);

    const context = notesList
      .map((doc) => `[Title: ${doc.title}]\n${doc.content}`)
      .join("\n\n");

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(context),
        },
        // Adding previous messages to Groq for conversation memory!
        ...currentHistory.slice(-6), // Send last 3 exchanges for context
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // lower temps for accurate responses
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    return {
      status: "success" as const,
      message: "Success",
      response: [
        ...currentHistory,
        { role: "user", content: prompt },
        { role: "assistant", content: aiResponse },
      ] as [
        { role: "user"; content: string },
        { role: "assistant"; content: string },
      ],
    };
  } catch (error) {
    console.error("RAG_ACTION_ERROR:", error);

    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
      response: currentHistory,
    };
  }
};

/*
 * AI Web Summary action:
 * - gets url string
 * - parsing and sanitization of web page
 * - sending prompt response data IF FAILS sends error IF SUCCESS returns output
 */
export const WebSummaryAction = async (
  url: string,
): Promise<SummaryActionType> => {
  if (!url) return { status: "warning", message: "URL is required" };

  // Parse & Sanitize
  const parseResult = await parseWebPage(url);

  const { title, content, plainText } = parseResult.response!;

  if (parseResult.status === "error") {
    return { status: "error", message: parseResult.message };
  }

  // Summarizing using the semantic plain text
  try {
    if (!title || !content || !plainText)
      return { status: "error", message: "File parsing response error" };
    else {
      const prompt = getPromptForProcessing(title, plainText);

      const summaryObject = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
      });

      const summary = summaryObject.choices[0]?.message?.content || "";

      // for tiptap
      return {
        status: "success",
        message: "Summary created successfully",
        response: {
          title,
          summary,
          content,
        },
      };
    }
  } catch (error) {
    console.error("SUMMARY_ERROR:", error);
    return { status: "error", message: "Failed to generate summary via Groq" };
  }
};

/*
 * AI File Summary action:
 * - getting file
 * - checking file IF FAIL send error IF SUCCESS goto next
 * - getting parsed file IF FAIL send error IF SUCCESS goto next
 * - purifying, creating plain text, creating prompt, getting ai response object IF FAIL send error IF SUCCESS return object
 */
export const FileSummaryAction = async (
  formData: FormData,
): Promise<SummaryActionType> => {
  const file = formData.get("file") as File;
  const DOMPurify = await import("isomorphic-dompurify");

  // Server-side size check
  if (file.size > MAX_FILE_SIZE) {
    return {
      status: "error",
      message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 5MB limit.`,
    };
  }

  if (!file) return { status: "error", message: "No file provided" };

  try {
    // Extracting Content from PDF/DOCX
    const parsedFile = await parseLocalFile(file);

    if (!parsedFile.response)
      return { status: "error", message: "File Parsing Error" };

    // Sanitizing for Tiptap
    const cleanedContent = DOMPurify.sanitize(parsedFile.response.content);

    // Creating Plain Text for Groq
    const plainText = cleanedContent
      .replace(/<[^>]*>?/gm, "")
      .substring(0, 15000);

    // Summary prompt for Groq
    const prompt = getPromptForProcessing(parsedFile.response.title, plainText);

    // Summary object
    const summaryObject = await groqClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const summary = summaryObject.choices[0]?.message?.content || "";

    return {
      status: "success",
      message: "File parsed successfully",
      response: {
        title: parsedFile.response.title,
        summary,
        content: cleanedContent,
        size: (file.size / 1024).toFixed(1) + " KB", //*Format size for the badge
      },
    };
  } catch (error) {
    console.error("FILE_PROCESS_ERROR:", error);
    //@ts-expect-error {status:string,message:string}
    return { status: "error", message: error.message };
  }
};

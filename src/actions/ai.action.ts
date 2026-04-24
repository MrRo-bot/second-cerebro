"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createStreamableValue } from "@ai-sdk/rsc";

import { groqClient, parseTranscript, semanticSearchQuery } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { parseWebPage } from "@/lib/ai";
import { parseLocalFile } from "@/lib/ai";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { buildSystemPrompt, getPromptForProcessing } from "@/lib/utils";

import { addNoteAction } from "./note.action";

import { AIRagActionType, SummaryActionType } from "@/types/ai";
import { NoteActionType } from "@/types/note";

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
  const stream = createStreamableValue("");

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

    (async () => {
      // sanitized history: Converting any StreamableValue objects back to strings
      // or placeholders so Groq doesn't choke on them.
      const sanitizedHistory = currentHistory.map((msg) => ({
        role: msg.role,
        content:
          typeof msg.content === "string" ? msg.content : "[Streaming Content]",
      }));

      const rawStream = await groqClient.chat.completions.create({
        messages: [
          { role: "system", content: buildSystemPrompt(context) },
          ...sanitizedHistory.slice(-6), // Use the sanitized version here
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        stream: true,
        temperature: 0.1,
      });

      let fullContent = "";
      for await (const chunk of rawStream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        stream.update(fullContent);
      }
      stream.done();
    })();

    return {
      status: "success" as const,
      message: "Success",
      response: [
        ...currentHistory,
        { role: "user", content: prompt },
        { role: "assistant", content: stream.value },
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
  state: SummaryActionType,
  formData: FormData,
): Promise<SummaryActionType> => {
  const url = formData.get("webUrl") as string;
  if (!url) return { status: "warning", message: "URL is required" };

  // Parse & Sanitize
  const parseResult = await parseWebPage(url);

  if (parseResult.status === "error") {
    return { status: "error", message: parseResult.message };
  }

  const { title, content, plainText } = parseResult.response!;

  let noteId: string | null = null;

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
      if (summary) console.log("summary created successfully");

      // new note form object created to save the note
      const noteFormData = new FormData();
      noteFormData.append("title", title);
      noteFormData.append("content", summary);

      const addNoteResult = await addNoteAction(
        {} as NoteActionType,
        noteFormData,
      );

      if (addNoteResult.status === "success" && addNoteResult.newNoteId) {
        noteId = addNoteResult.newNoteId; // Store ID to redirect later
      } else {
        console.error("Failed to save note:", addNoteResult.message);
        return {
          status: "error",
          message: "Summary created but failed to save note",
        };
      }
    }
  } catch (error) {
    console.error("SUMMARY_ERROR:", error);
    return {
      status: "error",
      message: "Failed to generate summary or save note",
    };
  }

  //redirect to note id route
  if (noteId) {
    redirect(`/dashboard/${noteId}`);
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
  state: SummaryActionType,
  formData: FormData,
): Promise<SummaryActionType> => {
  const file = formData.get("file") as File;
  if (!file) return { status: "error", message: "No file provided" };

  // Server-side size check
  if (file.size > MAX_FILE_SIZE) {
    return {
      status: "error",
      message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 5MB limit.`,
    };
  }

  let noteId: string | null = null;

  try {
    // Extracting Content from PDF/DOCX
    const parsedFile = await parseLocalFile(file);

    if (parsedFile.status === "error" || !parsedFile.response)
      return {
        status: "error",
        message: parsedFile.message || "Parsing Failed",
      };

    // Sanitizing for Tiptap
    const cleanedPlainText = parsedFile.response.content
      .replace(/<[^>]*>?/gm, "")
      .substring(0, 15000);

    // Summary prompt for Groq
    const prompt = getPromptForProcessing(
      parsedFile.response.title,
      cleanedPlainText,
    );

    // Summary object
    const summaryObject = await groqClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const summary = summaryObject.choices[0]?.message?.content || "";

    //new note form object created to save the note
    const noteFormData = new FormData();
    noteFormData.append("title", parsedFile.response.title);
    noteFormData.append("content", summary);

    const addNoteResult = await addNoteAction(
      {} as NoteActionType,
      noteFormData,
    );

    if (addNoteResult.status === "success" && addNoteResult.newNoteId) {
      noteId = addNoteResult.newNoteId; // Store ID to redirect later
    } else {
      console.error("Failed to save note:", addNoteResult.message);
      return {
        status: "error",
        message: "Summary created but failed to save note",
      };
    }
  } catch (error) {
    console.error("FILE_PROCESS_ERROR:", error);
    //@ts-expect-error {status:string,message:string}
    return { status: "error", message: error.message };
  }

  //redirect to note id route
  if (noteId) {
    redirect(`/dashboard/${noteId}`);
  }
};

/*
 * AI Transcript Summary action:
 * - getting url
 * - checking url IF FAIL send error IF SUCCESS goto next
 * - getting parsed text IF FAIL send error IF SUCCESS goto next
 * - creating plain text, creating prompt, getting ai response object IF FAIL send error IF SUCCESS return object
 */
export const TranscriptSummaryAction = async (
  state: SummaryActionType,
  formData: FormData,
): Promise<SummaryActionType> => {
  const url = formData.get("youtubeUrl") as string;
  if (!url) return { status: "error", message: "No URL provided" };

  let noteId: string | null = null;

  try {
    // Extracting Content from youtube transcript
    const transcript = await parseTranscript(url);

    if (!transcript.response) throw new Error(transcript.message);

    // Creating limited text for Groq
    const plainText = transcript.response?.content.substring(0, 15000);

    const prompt = getPromptForProcessing(
      transcript.response?.title,
      plainText,
    );

    // Summary object
    const summaryObject = await groqClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const summary = summaryObject.choices[0]?.message?.content || "";

    //new note form object created to save the note
    const noteFormData = new FormData();
    noteFormData.append("title", transcript.response?.title);
    noteFormData.append("content", summary);

    const addNoteResult = await addNoteAction(
      {} as NoteActionType,
      noteFormData,
    );

    if (addNoteResult.status === "success" && addNoteResult.newNoteId) {
      noteId = addNoteResult.newNoteId; // Store ID to redirect later
    } else {
      console.error("Failed to save note:", addNoteResult.message);
      return {
        status: "error",
        message: "Summary created but failed to save note",
      };
    }
  } catch (error) {
    console.error("TRANSCRIPT_PROCESS_ERROR:", error);
    //@ts-expect-error {status:string,message:string}
    return { status: "error", message: error.message };
  }

  //redirect to note id route
  if (noteId) {
    redirect(`/dashboard/${noteId}`);
  }
};

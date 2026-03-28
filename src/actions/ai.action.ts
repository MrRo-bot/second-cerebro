"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { groqClient, semanticSearchQuery } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { notes, users } from "@/lib/collections";
import { AIRagActionType } from "@/types/ai";

/*
 * AI RAG action:
 * - gets formData
 * - preserves chat history
 * - finds users and notes data IF FAILS sends errors IF SUCCESS goto next
 * - creates context from relevant chosen data
 * - contacts groq and returns chat related data
 * - finds response data in chat related data
 * - finds response data in chat related data IF FAILS sends error IF SUCCESS returns output for UI
 */
export const AIRagAction = async (
  state: AIRagActionType,
  formData: FormData,
): Promise<AIRagActionType> => {
  const prompt = formData.get("prompt") as string;

  const currentHistory = state?.response || [];

  try {
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
      query: { disableCookieCache: true },
    });

    if (!session?.user?.id) {
      //TODO: TOAST
      return {
        success: false,
        message: "Unauthorized",
        response: currentHistory,
      };
    }

    const userId = new ObjectId(session.user.id);

    const userExists = await users.findOne({ _id: userId });
    if (!userExists) {
      //TODO: TOAST
      return {
        success: false,
        message: "User not found",
        response: currentHistory,
      };
    }

    const hasNotes = await notes.findOne({ userId });
    if (!hasNotes) {
      //TODO: TOAST
      return {
        success: false,
        message: "No notes found, Create Notes.",
        response: currentHistory,
      };
    }

    const notesList = await semanticSearchQuery(prompt, userId, 10, 100);

    const context = notesList
      .map((doc) => `[Title: ${doc.title}]\n${doc.content}`)
      .join("\n\n---\n\n");

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Second Brain assistant. Context: ${context || "No relevant notes found in the knowledge base"}`,
        },
        //* Adding previous messages to Groq for conversation memory!
        ...currentHistory.slice(-6), //* Send last 3 exchanges for context
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";

    return {
      //TODO: TOAST
      success: true,
      message: "Prompt returned some response",
      response: [
        ...currentHistory,
        { role: "user", content: prompt },
        { role: "assistant", content: response },
      ] as [
        { role: "user"; content: string },
        { role: "assistant"; content: string },
      ],
    };
  } catch (e) {
    //TODO: TOAST
    return { success: false, message: "Error: " + e, response: currentHistory };
  }
};

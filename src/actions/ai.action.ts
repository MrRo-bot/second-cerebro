"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { groqClient, semanticSearchQuery } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { notes, users } from "@/lib/collections";
import { AIRagActionType } from "@/types/ai";

export const AIRagAction = async (
  state: AIRagActionType,
  formData: FormData,
): Promise<AIRagActionType> => {
  const prompt = formData.get("prompt") as string;

  //preserving history or starting fresh
  const currentHistory = state?.response || [];

  try {
    // finding users and notes
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
      query: { disableCookieCache: true },
    });

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        response: currentHistory,
      };
    }

    const userId = new ObjectId(session.user.id);

    const userExists = await users.findOne({ _id: userId });
    if (!userExists) {
      return {
        success: false,
        message: "User not found",
        response: currentHistory,
      };
    }

    const hasNotes = await notes.findOne({ userId });
    if (!hasNotes) {
      return {
        success: false,
        message: "No notes found, Create Notes.",
        response: currentHistory,
      };
    }

    const notesList = await semanticSearchQuery(prompt, userId, 10, 100);

    // creating string of notes using their title and content only
    const context = notesList
      .map((doc) => `[Title: ${doc.title}]\n${doc.content}`)
      .join("\n\n---\n\n");

    // Groq Completion
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Second Brain assistant. Context: ${context || "No relevant notes found in the knowledge base"}`,
        },
        // Add previous messages to Groq for conversation memory!
        ...currentHistory.slice(-6), // Send last 3 exchanges for context
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";

    return {
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
    return { success: false, message: "Error: " + e, response: currentHistory };
  }
};

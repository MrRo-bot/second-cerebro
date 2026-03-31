"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { groqClient, semanticSearchQuery } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { AIRagActionType } from "@/types/ai";

const buildSystemPrompt = (context: string) => `
  You are a Second Brain assistant.
  Use the follwing context to answer:
  ---
  ${context || "No relevant notes found."}
  ---
`;

/*
 * AI RAG action:
 * - gets formData
 * - preserves chat history
 * - finds session IF FAILS sends errors IF SUCCESS goto next
 * - creates context from relevant chosen data
 * - contacts groq and returns chat related data
 * - finds response data in chat related data
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
      status: "error",
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
        //* Adding previous messages to Groq for conversation memory!
        ...currentHistory.slice(-6), //* Send last 3 exchanges for context
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, //* lower temps for accurate responses
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
  } catch (e) {
    console.error("RAG_ACTION_ERROR:", e);
    return {
      status: "error" as const,
      message: "An unexpected error occured.",
      response: currentHistory,
    };
  }
};

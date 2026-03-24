"use server";

import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { embeddingCreator } from "@/lib/groq";
import { NoteValidationType } from "@/types/note";
import { NewNoteSchema } from "@/lib/definitions";
import { notes, users } from "@/lib/collections";
import { revalidatePath } from "next/cache";

export const addNoteAction = async (
  state: NoteValidationType,
  formData: FormData,
) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  // VALIDATING NEW NOTE FIELDS USING ZOD
  const validatedFields = NewNoteSchema.safeParse({
    title,
    content,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const user = await users.findOne({ _id: new ObjectId(session?.user.id) });
  if (!user) {
    //toast
    throw new Error("User not found");
  }

  //creating vector embedding using llama nomic API
  const embedding = await embeddingCreator(title, content);

  const noteResult = await notes.insertOne({
    userId: new ObjectId(user._id),
    title,
    content,
    embedding: embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    success: true,
    note: JSON.stringify(noteResult),
  };
};

export async function deleteNoteAction(noteId: string) {
  try {
    await notes.deleteOne({ _id: new ObjectId(noteId) });
    //refresh notes list
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw new Error("Delete failed");
  }
}

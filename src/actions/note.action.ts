"use server";

import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { embeddingCreator } from "@/lib/groq";
import { NoteValidationType } from "@/types/note";
import { NewNoteSchema } from "@/lib/definitions";
import { notes, users } from "@/lib/collections";

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
    throw new Error("User not found");
  }

  if (!notes) {
    throw new Error("Notes not found");
  }

  //creating vector embedding using Groq OpenAI API
  const embedding = await embeddingCreator(title, content);

  const noteResult = await notes.insertOne({
    userId: new ObjectId(user._id),
    title,
    content,
    embedding: embedding,
    createdAt: new Date(),
  });

  //adding note id to an array of note ids in a user
  await users.updateOne(
    { _id: new ObjectId(user._id) },
    { $push: { notes: noteResult.insertedId } },
  );

  return {
    success: true,
    note: JSON.stringify(noteResult),
  };
};

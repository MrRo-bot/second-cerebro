"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { embeddingCreator, semanticSearchQuery } from "@/lib/ai";
import { NewNoteSchema, SearchNoteSchema } from "@/lib/definitions";
import { notes, users } from "@/lib/collections";
import { cleanMarkdownForEmbedding } from "@/lib/utils";

import { NoteActionType, NoteSearchActionType, Note } from "@/types/note";

/*
 * Adding new note action:
 * - getting formData
 * - getting session
 * - validating data using zod validator IF FAILS sends error IF SUCCESS goto next
 * - validating if user and session exists using session IF FAILS sends error IF SUCCESS goto next
 * - creating vector embedding using nomic-embed-text-v1 API
 * - adding new note to the database
 */
export const addNoteAction = async (
  state: NoteActionType,
  formData: FormData,
): Promise<NoteActionType> => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const validatedFields = NewNoteSchema.safeParse({
    title,
    content,
  });

  if (!validatedFields.success) {
    return {
      status: "error" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Errors",
    };
  }

  try {
    const headerList = await headers();

    const session = await auth.api.getSession({
      headers: headerList,
      query: { disableCookieCache: true },
    });

    if (!session?.user) {
      return {
        status: "error" as const,
        message: "You must be a logged in to create a note",
      };
    }

    const userId = new ObjectId(session.user.id);
    const userExists = await users.findOne({ _id: userId });

    if (!userExists) {
      return { status: "error" as const, message: "User not found" };
    }

    const textToEmbed = `Title: ${title}\nContent: ${content}`;

    const embedding = await embeddingCreator(textToEmbed);

    await notes.insertOne({
      userId: new ObjectId(userId),
      title,
      content,
      embedding: embedding,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      status: "success" as const,
      message: "Note added successfully",
    };
  } catch (error) {
    return {
      status: "error" as const,
      message: "An unexpected error: " + JSON.stringify(error),
    };
  }
};

/*
 * Deleting note action:
 * - deleting note by given ID
 * - try: IF FAILS sends error IF SUCCESS redirects to /dashboard to refresh list
 */
export const deleteNoteAction = async (
  noteId: string,
): Promise<NoteActionType> => {
  try {
    await notes.deleteOne({ _id: new ObjectId(noteId) });

    revalidatePath("/dashboard");
    return {
      status: "success" as const,
      message: "Note deleted successfully",
    };
  } catch (error) {
    return {
      status: "error" as const,
      message: `Failed to delete note: ${error}`,
    };
  }
};

/*
 * Updating note action:
 * - updating note by given ID and payload data for updation
 * - checking if any field requires updation IF FAILS sends error IF SUCCESS goto next
 * - checking if note exists IF FAILS send errors IF SUCCESS goto next
 * - updates the note with embedding vector IF FAILS sends error IF SUCCESS redirects to /dashboard to refresh list
 */
export const updateNoteAction = async (
  noteId: string,
  payload: { title?: string; content?: string },
): Promise<NoteActionType> => {
  const updateData: Record<string, unknown> = {};

  //* Only add fields that are actually provided and not empty
  if (payload.title?.trim()) {
    updateData.title = payload.title.trim();
  }
  if (payload.content?.trim()) {
    updateData.content = payload.content.trim();
  }

  if (Object.keys(updateData).length === 0)
    return {
      status: "warning" as const,
      message: "No fields to update",
    };

  try {
    const existingNote = await notes.findOne({ _id: new ObjectId(noteId) });
    if (!existingNote)
      return {
        status: "error" as const,
        message: "Note not found",
      };

    const updatedTitle = payload.title || existingNote.title;
    const updatedContent = payload.content || existingNote.content;

    //* Clean markdown for better embeddings (Nomic performs better on clean text)
    const cleanContent = cleanMarkdownForEmbedding(updatedContent);

    const textToEmbed = `Title: ${updatedTitle}\nContent: ${cleanContent}`;

    const newEmbedding = await embeddingCreator(textToEmbed);

    await notes.updateOne(
      { _id: new ObjectId(noteId) },
      {
        $set: {
          ...updateData,
          embedding: newEmbedding,
          updatedAt: new Date(),
        },
      },
    );

    revalidatePath("/dashboard");

    return {
      status: "success" as const,
      message: "Note updated successfully",
    };
  } catch (error) {
    return {
      status: "warning" as const,
      message: `Failed to update note: ${error}`,
    };
  }
};

/*
 * Searching note action:
 * - getting formData
 * - getting session
 * - validating query string using zod validator IF FAILS sends error IF SUCCESS goto next
 * - validating if userID exists using session IF FAILS sends error IF SUCCESS goto next
 * - creating vector embedding of query string using nomic-embed-text-v1 API
 * - validating if notes exists using id IF FAILS sends error IF SUCCESS goto next
 * - validating if query returns results IF FAILS sends error IF SUCCESS returning notes list
 */
export const searchNoteAction = async (
  state: NoteSearchActionType,
  formData: FormData,
): Promise<NoteSearchActionType> => {
  const queryString = formData.get("search") as string;

  try {
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
      query: { disableCookieCache: true },
    });

    const validatedFields = SearchNoteSchema.safeParse({ queryString });

    if (!validatedFields.success) {
      return {
        status: "error" as const,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid search input",
      };
    }

    if (!session?.user?.id) {
      return { status: "error" as const, message: "Unauthorized" };
    }

    const userId = new ObjectId(session.user.id);

    const userExists = await users.findOne({ _id: userId });
    if (!userExists) {
      return { status: "error" as const, message: "User not found" };
    }

    const hasNotes = await notes.findOne({ userId });
    if (!hasNotes) {
      return {
        status: "error" as const,
        message: "No notes found, Create one",
      };
    }

    const results = await semanticSearchQuery(queryString, userId);

    if (results.length === 0) {
      return {
        status: "warning" as const,
        message: "No notes matching the result",
      };
    }

    return {
      status: "success" as const,
      notesList: JSON.parse(JSON.stringify(results)) as Note[],
      message: "Search Results found",
    };
  } catch (error) {
    return {
      status: "error" as const,
      message: `An unexpected error occured: ${error}`,
    };
  }
};

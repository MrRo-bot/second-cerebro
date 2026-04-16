"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { autoTagNote, embeddingCreator, semanticSearchQuery } from "@/lib/ai";
import { NewNoteSchema, SearchNoteSchema } from "@/lib/definitions";
import { notes } from "@/lib/collections";
import { cleanMarkdownForEmbedding } from "@/lib/utils";

import { NoteActionType, NoteSearchActionType } from "@/types/note";

const safeObjectId = (id: string) =>
  ObjectId.isValid(id) ? new ObjectId(id) : undefined;

/*
 * Adding new note action:
 * - getting formData
 * - getting session
 * - validating data using zod validator IF FAILS sends error IF SUCCESS goto next
 * - validating if session exists using session IF FAILS sends error IF SUCCESS goto next
 * - creating vector embedding using nomic-embed-text-v1 API
 * - adding new note to the database
 */
export const addNoteAction = async (
  state: NoteActionType,
  formData: FormData,
) => {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = NewNoteSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      status: "warning" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Errors",
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        status: "error" as const,
        message: "Unauthorized",
      };
    }

    const userId = new ObjectId(session.user.id);
    const { title, content } = validatedFields.data;
    const textToEmbed = `Title: ${title}\nContent: ${content}`;
    const embedding = await embeddingCreator(textToEmbed);

    const result = await notes.insertOne({
      userId,
      title,
      content,
      embedding,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newNoteId = result.insertedId.toString();

    if (newNoteId) {
      //updating tags based on new content and embedding
      await autoTagNote(newNoteId, title, content);
    }

    revalidatePath("/dashboard");
    return {
      status: "success" as const,
      message: "Note added successfully",
      newNoteId,
    };
  } catch (error) {
    console.error("ADD_NOTE_ERROR:", error);
    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
    };
  }
};

/*
 * Deleting note action:
 * - deleting note by given ID
 * - try: IF FAILS sends error IF SUCCESS redirects to /dashboard to refresh list
 */
export const deleteNoteAction = async (noteId: string) => {
  try {
    await notes.deleteOne({ _id: new ObjectId(noteId) });

    revalidatePath("/dashboard");
    return {
      status: "success" as const,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("DELETE_NOTE_ERROR:", error);
    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
    };
  }
};

/*
 * Updating note action:
 * - updating note by given ID and payload data for updation
 * - checking if id is valid
 * - Only add fields that are actually provided and not empty
 * - checking if any field requires updation IF FAILS sends error IF SUCCESS goto next
 * - checking if note exists IF FAILS send errors IF SUCCESS goto next
 * - Clean markdown for better embeddings (Nomic performs better on clean text)
 * - updates the note with embedding vector IF FAILS sends error IF SUCCESS redirects to /dashboard to refresh list
 */
export const updateNoteAction = async (
  noteId: string,
  payload: {
    title?: string;
    content?: string;
    manualTags?: string[]; // ← User edited tags
  },
) => {
  const oid = safeObjectId(noteId);
  if (!oid) return { status: "error" as const, message: "Invalid Note ID" };

  const updateData: Partial<{
    title: string;
    content: string;
    tags: string[];
  }> = {};

  if (payload.title?.trim()) {
    updateData.title = payload.title.trim();
  }

  if (payload.content?.trim()) {
    updateData.content = payload.content.trim();
  }

  const hasManualTagUpdate = payload.manualTags !== undefined;
  const contentChanged = !!payload.content;

  // Early exit if nothing to update
  if (
    Object.keys(updateData).length === 0 &&
    !hasManualTagUpdate &&
    !contentChanged
  ) {
    return { status: "warning" as const, message: "No fields to update" };
  }

  try {
    const existingNote = await notes.findOne({ _id: oid });
    if (!existingNote) {
      return { status: "error" as const, message: "Note not found" };
    }

    const updatedTitle = payload.title || existingNote.title;
    const updatedContent = payload.content || existingNote.content;

    // Start with existing tags or user's manual tags
    let finalTags: string[] = hasManualTagUpdate
      ? payload.manualTags!.map((t) => t.trim().toLowerCase())
      : existingNote.tags || [];

    // If content changed → get fresh auto tags and merge
    if (contentChanged) {
      const autoSuggestedTags = await autoTagNote(
        noteId,
        updatedTitle,
        updatedContent,
      );

      // Merge: Keeps manual tags + add new auto tags (no duplicates)
      if (Array.isArray(autoSuggestedTags)) {
        finalTags = [...new Set([...finalTags, ...autoSuggestedTags])].slice(
          0,
          5,
        );
      }
    }

    // Add final tags to update
    updateData.tags = finalTags;

    // Generates embedding
    const cleanContent = cleanMarkdownForEmbedding(updatedContent);
    const textToEmbed = `Title: ${updatedTitle}\nContent: ${cleanContent}`;
    const newEmbedding = await embeddingCreator(textToEmbed);

    // Final database update
    await notes.updateOne(
      { _id: oid },
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
    console.error("UPDATE_NOTE_ERROR:", error);
    return { status: "error" as const, message: "Failed to update note" };
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
 * - Manual mapping for deep objects
 */
export const searchNoteAction = async (
  state: NoteSearchActionType,
  formData: FormData,
) => {
  const queryString = formData.get("search") as string;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
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

    const results = await semanticSearchQuery(queryString, userId);

    if (results.length === 0) {
      return {
        status: "warning" as const,
        message: "No notes matching the result",
      };
    }

    const serializedNotes = results.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    }));

    return {
      status: "success" as const,
      notesList: serializedNotes,
      message: "Search Results found",
    };
  } catch (error) {
    console.error("SEARCH_NOTE_ERROR:", error);
    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
    };
  }
};

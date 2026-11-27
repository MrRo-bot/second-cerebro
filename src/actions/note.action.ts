"use server";

import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { autoTagNote, embeddingCreator, semanticSearchQuery } from "@/lib/ai";
import { NewNoteSchema, SearchNoteSchema } from "@/lib/definitions";
import { getCollections } from "@/lib/collections";
import { cleanMarkdownForEmbedding, normalizeError } from "@/lib/utils";

import { NoteActionType, NoteSearchActionType } from "@/types/note";
import { DEFAULT_MATRYOSHKA_DIM } from "@/lib/constants";

const safeObjectId = (id: string): ObjectId | null => {
  // Ensures it's a valid ObjectId AND strictly a 24-char hex string
  if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
    return new ObjectId(id);
  }
  return null;
};

const normalizeTags = (tags: string[]) => [
  ...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)),
];


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
      message: "Validation errors",
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
    if (!userId)
      return { status: "error" as const, message: "Invalid user ID" };

    const {notes} = await getCollections();
    const { title, content, type } = validatedFields.data;
    
    const cleanContent = cleanMarkdownForEmbedding(content)
    const textToEmbed = `Title: ${title}\nContent: ${cleanContent}`;
    
    //Independent calls, running them concurrently
    const [embedding,tags] = await Promise.all([

      embeddingCreator(textToEmbed,DEFAULT_MATRYOSHKA_DIM,'RETRIEVAL_DOCUMENT'),
      autoTagNote(title,content).then((t)=>normalizeTags(t).slice(0,5)).catch((error)=>{
        //Tagging is best-effort; the note should still save
        console.error('AUTO_TAG_ERROR: ', error)
        return [] as string[]
      })
    ]) 

    const now = new Date()
    const result = await notes.insertOne({
      userId,
      title,
      content,
      embedding,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      pinnedAt: null,
      type,
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");
    return {
      status: "success" as const,
      message: "Note added successfully",
      newNoteId:result.insertedId.toString(),
    };
  } catch (error) {
    console.error("ADD_NOTE_ERROR: ", error);
    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || 'Failed to add note',
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
};

/*
 * Deleting note action:
 * - deleting note by given ID
 * - try: IF FAILS sends error IF SUCCESS redirects to /dashboard to refresh list
 */
export const deleteNoteAction = async (noteId: string) => {
  const { notes } = await getCollections();
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
    if (!userId)
      return { status: "error" as const, message: "Invalid user ID" };

    const _id = safeObjectId(noteId);
    if (!_id) return { status: "error" as const, message: "Invalid note ID" };

    await notes.deleteOne({ _id, userId });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");
    return {
      status: "success" as const,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("DELETE_NOTE_ERROR: ", error);

    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to delete a note",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
};

/*
 * Deleting multiple note action:
 * - deleting multiple notes by given ID array
 * - try: IF FAILS sends error IF SUCCESS redirects to /dashboard to refresh list
 */
export const deleteMultipleNoteAction = async (noteIds: string[]) => {
  const { notes } = await getCollections();
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
    if (!userId)
      return { status: "error" as const, message: "Invalid user ID" };

    if (!noteIds.length)
      return { status: "warning" as const, message: "Note ID list is empty" };

    const noteIdList = noteIds.map(safeObjectId);

    if (noteIdList.some((id) => id === null)) {
      return { status: "error" as const, message: "Some note ids are invalid" };
    }

    await notes.deleteMany({
      _id: { $in: noteIdList as ObjectId[] },
      userId,
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");
    return {
      status: "success" as const,
      message: "Notes deleted successfully",
    };
  } catch (error) {
    console.error("DELETE_NOTES_ERROR: ", error);

    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed deleting notes",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
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
  payload: { title?: string; content?: string; manualTags?: string[] },
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { status: "error" as const, message: "Unauthorized" };
  }

  const userId = safeObjectId(session.user.id);
  if (!userId) return { status: "error" as const, message: "Invalid user ID" };

  const _id = safeObjectId(noteId);
  if (!_id) return { status: "error" as const, message: "Invalid note ID" };

  const nextTitle = payload.title?.trim();
  const nextContent = payload.content?.trim();
  const hasManualTags = payload.manualTags !== undefined;

  if (!nextTitle && !nextContent && !hasManualTags) {
    return { status: "warning" as const, message: "No fields to update" };
  }

  try {
    const { notes } = await getCollections();
    const existing = await notes.findOne({ _id, userId });
    if (!existing) {
      return { status: "error" as const, message: "Note not found" };
    }

    // Compare against stored values, not just "was a field sent"
    const titleChanged = !!nextTitle && nextTitle !== existing.title;
    const contentChanged = !!nextContent && nextContent !== existing.content;

    if (!titleChanged && !contentChanged && !hasManualTags) {
      return { status: "warning" as const, message: "No changes detected" };
    }

    const finalTitle = titleChanged ? nextTitle! : existing.title;
    const finalContent = contentChanged ? nextContent! : existing.content;

    const $set: Record<string, unknown> = { updatedAt: new Date() };
    if (titleChanged) $set.title = finalTitle;
    if (contentChanged) $set.content = finalContent;

    // Tags
    if (hasManualTags || contentChanged) {
      let tags = hasManualTags
        ? normalizeTags(payload.manualTags!)
        : existing.tags ?? [];

      if (contentChanged) {
        try {
          const auto = await autoTagNote(finalTitle, finalContent);
          tags = normalizeTags([...tags, ...auto]).slice(0, 5);
        } catch (err) {
          // Tagging is best-effort; don't fail the whole update
          console.error("AUTO_TAG_ERROR: ", err);
        }
      }
      $set.tags = tags;
    }

    // Embedding: only when the embedded text actually changed
    if (titleChanged || contentChanged) {
      const clean = cleanMarkdownForEmbedding(finalContent);
      $set.embedding = await embeddingCreator(
        `Title: ${finalTitle}\nContent: ${clean}`,
      );
    }

    await notes.updateOne({ _id, userId }, { $set });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");

    return { status: "success" as const, message: "Note updated successfully" };
  } catch (error) {
    console.error("UPDATE_NOTE_ERROR: ", error);
    const info = normalizeError(error);
    return {
      status: "error" as const,
      message: info.message || "Failed to update a note",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
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
 * - Manual mapping for deep objects
 */
export const searchNoteAction = async (
  state: NoteSearchActionType,
  formData: FormData,
) => {
  const queryString = formData.get("search") as string;

  const isClear = formData.get("clear") === "true";

  // Clear search
  if (isClear) {
    return {
      status: "info" as const,
      message: "Search history cleared",
      response: [],
    };
  }

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
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
      isPinned: doc.isPinned,
      type: doc.type,
      pinnedAt: doc?.pinnedAt?.toISOString(),
    }));

    return {
      status: "success" as const,
      notesList: serializedNotes,
      message: "Search results found",
    };
  } catch (error) {
    console.error("SEARCH_NOTE_ERROR: ", error);

    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to search notes",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
};

/*
 * Note pin toggling action:
 * - safe object ID parsing IF FAILS sends error IF SUCCESS goto next
 * - getting note by ID IF FAILS sends error IF SUCCESS goto next
 * - adding pinning related data to note by id IF FAILS sends error toast IF SUCCESS redirects to /dashboard to refresh list
 */
export const togglePinNoteAction = async (
  noteId: string,
  currentState: boolean,
) => {
  const { notes } = await getCollections();
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
    if (!userId)
      return { status: "error" as const, message: "Invalid user ID" };

    const _id = safeObjectId(noteId);
    if (!_id) return { status: "error" as const, message: "Invalid note ID" };

    await notes.updateOne(
      { _id, userId },
      {
        $set: {
          //adding current boolean status to pinned or not pinned
          isPinned: !currentState,
          //adding date object to sort by pinned by latest
          pinnedAt: !currentState ? new Date() : null,
        },
      },
    );

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");

    return {
      status: "success" as const,
      message: "Note pinned",
    };
  } catch (error) {
    console.error("PINNING_NOTE_ERROR: ", error);

    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to pin a note",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
};

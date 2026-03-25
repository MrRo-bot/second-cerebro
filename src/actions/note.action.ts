"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { embeddingCreator, semanticSearchQuery } from "@/lib/ai";
import { NoteValidationType, NoteSearchActionType, Note } from "@/types/note";
import { NewNoteSchema, SearchNoteSchema } from "@/lib/definitions";
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

  // Validating note fields using zod schema and zod function
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
  const textToEmbed = `Title: ${title}\nContent: ${content}`;
  const embedding = await embeddingCreator(textToEmbed);

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
    //toast
    console.error("Failed to delete note:", error);
    throw new Error("Delete failed");
  }
}

export async function updateNoteAction(
  noteId: string,
  payload: { title?: string; content?: string },
) {
  const updateData: Record<string, unknown> = {};

  if (payload.title !== "") updateData.title = payload.title;
  if (payload.content !== "") updateData.content = payload.content;

  if (Object.keys(updateData).length === 0) return;

  try {
    // Fetch the existing note to merge the new data
    const existingNote = await notes.findOne({ _id: new ObjectId(noteId) });
    if (!existingNote) throw new Error("Note not found");

    // full text for the new embedding
    const updatedTitle = payload.title || existingNote.title;
    const updatedContent = payload.content || existingNote.content;
    const textToEmbed = `Title: ${updatedTitle}\nContent: ${updatedContent}`;

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
  } catch (error) {
    console.error("Failed to update note:", error);
    throw new Error("Update failed");
  }
}

export async function searchNoteAction(
  state: NoteSearchActionType,
  formData: FormData,
): Promise<NoteSearchActionType> {
  // Explicitly define the return type
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
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid search input",
      };
    }

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = new ObjectId(session.user.id);

    // Check if user exists and has notes
    const userExists = await users.findOne({ _id: userId });
    if (!userExists) {
      return { success: false, message: "User not found" }; // Return instead of throw
    }

    const hasNotes = await notes.findOne({ userId });
    if (!hasNotes) {
      return {
        success: false,
        message: "No notes found to search. Create few notes first!",
      };
    }

    const results = await semanticSearchQuery(queryString, userId);

    if (results.length === 0) {
      return {
        success: false,
        message:
          "We couldn't find any notes matching that specific topic. Try using different keywords.",
      };
    }

    return {
      success: true,
      notesList: JSON.parse(JSON.stringify(results)) as Note[],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unexpected error occurred during search.",
    };
  }
}

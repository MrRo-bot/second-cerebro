import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import AIChat from "@/components/AIChat";
import NoteList from "@/components/note/NoteList";

import { auth } from "@/lib/auth";
//! import { embeddingCreator } from "@/lib/ai";
import { notes } from "@/lib/collections";

import { NoteType } from "@/types/note";

const Dashboard = async () => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    redirect("/login?message=Session Error&type=error");
  }

  const rawNotes = await notes
    .find({ userId: new ObjectId(session?.user?.id) })
    // .sort({ updatedAt: -1 })
    .toArray();

  const listOfNotes = rawNotes.map((note) => ({
    ...note,
    _id: note._id.toString(),
    userId: note.userId?.toString(),
  }));

  // Get all unique tags
  const allTags = [
    ...new Set(rawNotes.flatMap((note) => note.tags || [])),
  ].sort();

  /* 
    * adding dummy bson data with embedding==================

    ! const textToEmbed = `Title: ${""}\nContent: ${""}`;

    ! const newEmbedding = await embeddingCreator(textToEmbed);
    ! console.log(newEmbedding);
  */

  return (
    <>
      <div className="flex justify-center items-center">
        <AIChat />
      </div>
      <NoteList list={listOfNotes as unknown as NoteType[]} allTags={allTags} />
    </>
  );
};

export default Dashboard;

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import AIChat from "@/components/AI/AIChat";
import NoteList from "@/components/note/NoteList";

import { auth } from "@/lib/auth";
//! import { embeddingCreator } from "@/lib/ai";
import { getCollections } from "@/lib/collections";

const { notes } = await getCollections();

import { NoteType } from "@/types/note";

const Dashboard = async () => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    // Note: Server Components cannot mutate response cookies directly;
    // ensuring proxy/middleware clears session cookies on redirect (from previous step)
    // and that no client component inside /dashboard calls router.refresh() on auth error.
    redirect("/login?message=Session%20expired.%20Please%20login%20again&type=error");
  }

  const rawNotes = await notes
    .find({ userId: new ObjectId(session?.user?.id) }).project({embedding:0})
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

    ! const newEmbedding = await embeddingCreator(textToEmbed,matryoska_dim,'retrieval_document');
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

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ObjectId } from "mongodb";

import KnowledgeGraph from "@/components/KnowledgeGraph";

import { auth } from "@/lib/auth";
import { getCollections } from "@/lib/collections";
import { buildHybridGraph } from "@/lib/graph";

import { NoteType } from "@/types/note";
import CustomLoading from "@/components/CustomLoading";

const { notes } = await getCollections();

const Graph = async () => {
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
    .project({ _id: 1, title: 1, tags: 1, embedding: 1 })
    .toArray();

  const graphData = buildHybridGraph(rawNotes as unknown as NoteType[]);

  return (
    <div className="h-[calc(100vh-51px)] w-full border rounded-2xl overflow-hidden relative">
      {/* graph area size doesnt change if screen width changes */}
      <Suspense
        fallback={
          <div className="size-full flex items-center justify-center text-slate-400">
            <CustomLoading text="Rendering..." />
          </div>
        }
      >
        <KnowledgeGraph graphData={graphData} />
      </Suspense>
    </div>
  );
};
export default Graph;

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ObjectId } from "mongodb";

import KnowledgeGraph from "@/components/KnowledgeGraph";

import { auth } from "@/lib/auth";
import { notes } from "@/lib/collections";
import { buildHybridGraph } from "@/lib/graph";

import { NoteType } from "@/types/note";

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
    .toArray();

  const graphData = buildHybridGraph(rawNotes as unknown as NoteType[]);

  return (
    <div className="h-[calc(100vh-10vh)]  border rounded-2xl overflow-hidden bg-zinc-950 relative">
      {/* graph area size doesnt change if screen width changes */}
      <Suspense
        fallback={
          <div className="size-full flex items-center justify-center text-slate-400">
            Loading 3D Knowledge Graph...
          </div>
        }
      >
        <KnowledgeGraph graphData={graphData} />
      </Suspense>
    </div>
  );
};
export default Graph;

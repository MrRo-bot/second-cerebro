import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { Button } from "@/components/ui/button";
import UpdateNote from "@/components/note/UpdateNote";

import { auth } from "@/lib/auth";
import { notes } from "@/lib/collections";
import { renderToast } from "@/lib/utils";

const NotePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Validating ObjectId
  let noteId: ObjectId;
  try {
    noteId = new ObjectId(id);
  } catch {
    renderToast({ status: "warning" as const, message: "Invalid Note ID" });
    notFound();
  }

  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    renderToast({ status: "error" as const, message: "Unauthorized" });
    redirect("/login?message=Session Error&type=error");
  }

  // Fetching note (only user's own note)
  const note = await notes.findOne({
    _id: noteId,
    userId: new ObjectId(session?.user?.id),
  });

  if (!note) {
    renderToast({ status: "warning" as const, message: "Error opening note" });
    notFound();
  }

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Note</h1>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="cursor-pointer rounded-lg pt-0.5"
            >
              <span className="mb-0.5">←</span>
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <UpdateNote
          noteId={id}
          noteTitle={note.title}
          noteContent={note.content}
          noteTags={note?.tags}
          noteUpdatedAt={note?.updatedAt}
        />
      </div>
    </div>
  );
};

export default NotePage;

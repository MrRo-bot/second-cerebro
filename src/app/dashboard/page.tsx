import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { format, formatRelative } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DeleteNote from "@/components/note/DeleteNote";
import UpdateNote from "@/components/note/UpdateNote";
import AIChat from "@/components/AIChat";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

import { auth } from "@/lib/auth";
//! import { embeddingCreator } from "@/lib/ai";
import { notes } from "@/lib/collections";

const Dashboard = async () => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    redirect("/login?message=Session Error&type=error");
  }

  const listOfNotes = await notes
    .find({ userId: new ObjectId(session?.user?.id) })
    .toArray();

  /* 
    * adding dummy bson data with embedding==================

    ! const textToEmbed = `Title: ${""}\nContent: ${""}`;

    ! const newEmbedding = await embeddingCreator(textToEmbed);
    ! console.log(newEmbedding);
  */

  return (
    <div>
      <div className="flex justify-center items-center">
        <AIChat />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-content-center items-center justify-center gap-6 py-10">
        {listOfNotes.length ? (
          listOfNotes.map((n) => (
            <Card
              className="h-full flex-col flex justify-between"
              key={n._id.toString()}
            >
              <CardHeader className="flex justify-between items-center">
                <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 text-ellipsis w-5/6">
                  {n.title}
                </h3>
                <div className="flex items-center justify-between w-max gap-2">
                  <UpdateNote
                    id={n._id.toString()}
                    title={n.title}
                    content={n.content}
                  />
                  <DeleteNote id={n._id.toString()} />
                </div>
              </CardHeader>
              <CardContent className="w-5/6 line-clamp-4 text-ellipsis mb-auto">
                {/* rendering markdown */}
                <MarkdownRenderer content={n.content} />
              </CardContent>
              <CardFooter className="py-1 px-4 text-slate-600 flex flex-col items-start justify-center">
                <p>
                  created: {format(n.createdAt, "do 'of' MMMM 'at' HH:MM aa")}
                </p>
                <p>updated: {formatRelative(n.updatedAt, new Date())}</p>
                <div>tags</div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-start-1 -col-end-1">
            <EmptyPlaceholder
              type="note"
              title="NO NOTES YeT"
              description="You haven't created any notes yet. Get started by creating your
          first note."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

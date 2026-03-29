import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { format, formatRelative } from "date-fns";

import { auth } from "@/lib/auth";
//! import { embeddingCreator } from "@/lib/ai";
import { notes } from "@/lib/collections";

import AddNote from "@/components/AddNote";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DeleteNote from "@/components/DeleteNote";
import UpdateNote from "@/components/UpdateNote";
import SemanticSearch from "@/components/SemanticSearch";
import AIChat from "@/components/AIChat";

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
      <div className="flex justify-between items-center mx-5">
        <AddNote />
        <SemanticSearch />
        <AIChat />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-6 py-10">
        {listOfNotes.length
          ? listOfNotes.map((n) => (
              <Card key={n._id.toString()}>
                <CardHeader className="flex justify-between items-center">
                  <h3 className="uppercase font-heading font-bold tracking-widest">
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
                <CardContent className="w-5/6 line-clamp-2 text-ellipsis">
                  {n.content}
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
          : "No notes yet"}
      </div>
    </div>
  );
};

export default Dashboard;

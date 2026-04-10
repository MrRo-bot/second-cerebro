import Link from "next/link";
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
import AIChat from "@/components/AIChat";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import { Badge } from "@/components/ui/badge";

import { auth } from "@/lib/auth";
//! import { embeddingCreator } from "@/lib/ai";
import { notes } from "@/lib/collections";
import { capitalizeTag } from "@/lib/utils";

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
          listOfNotes
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((n) => (
              <Card
                key={n._id.toString()}
                className="h-full flex-col flex justify-between"
              >
                <CardHeader className="relative flex justify-between items-center">
                  <Link
                    className="absolute inset-0 inline-block"
                    href={`dashboard/${n._id.toString()}`}
                  />
                  <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 text-ellipsis w-5/6">
                    {n.title}
                  </h3>
                </CardHeader>
                <CardContent className="relative w-5/6 line-clamp-4 text-ellipsis mb-auto">
                  <Link
                    className="absolute inset-0 inline-block"
                    href={`dashboard/${n._id.toString()}`}
                  />
                  {/* rendering markdown */}
                  <MarkdownRenderer content={n.content} />
                </CardContent>
                <CardFooter className="py-1 px-4 text-slate-600 flex flex-col items-start justify-center">
                  <p>
                    created: {format(n.createdAt, "do 'of' MMMM 'at' HH:MM aa")}
                  </p>
                  <p>updated: {formatRelative(n.updatedAt, new Date())}</p>

                  <div className="h-6 flex gap-1 flex-wrap line-clamp-1 justify-left items-center max-w-10/12">
                    {n.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full pt-1"
                      >
                        {capitalizeTag(tag)}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))
        ) : (
          <div className="col-start-1 -col-end-1">
            <EmptyPlaceholder
              type="note"
              title="NO NOTES YET"
              description="You haven't created any notes yet, Get started by creating your
          first note"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

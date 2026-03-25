import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
// import { embeddingCreator } from "@/lib/ai";
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
// import AIChat from "@/components/AIChat";

const Dashboard = async () => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    redirect("/login");
  }

  const listOfNotes = await notes
    .find({ userId: new ObjectId(session?.user?.id) })
    .toArray();

  //adding dummy bson data with embedding==================
  // const textToEmbed = `Title: ${"MERN: MongoDB Indexing for Search"}\nContent: ${"Create a 'text' index on 'title' and 'content' fields to support basic search while the Vector/Embedding search is being calibrated."}`;

  // const newEmbedding = await embeddingCreator(textToEmbed);
  // console.log(newEmbedding);

  return (
    <div>
      <div className="flex justify-evenly items-center">
        <AddNote />
        <SemanticSearch />
        {/* <AIChat /> */}
      </div>
      {listOfNotes.length ? (
        <div className="grid grid-cols-2 items-center justify-center gap-6 p-10 outline-2 outline-dotted outline-blue-300 m-10">
          {listOfNotes.map((n) => (
            <Card className="p-0" key={n._id.toString()}>
              <CardHeader className="uppercase font-heading flex justify-between items-center">
                {n.title}
                <div className="flex items-center justify-between w-max gap-2 p-1">
                  <UpdateNote
                    id={n._id.toString()}
                    title={n.title}
                    content={n.content}
                  />
                  <DeleteNote id={n._id.toString()} />
                </div>
              </CardHeader>
              <CardContent>{n.content}</CardContent>
              <CardFooter className="gap-2 py-0.5 px-2">
                <p>
                  createdAt:
                  {" " +
                    new Date(n.createdAt).toLocaleDateString() +
                    " " +
                    new Date(n.createdAt).toLocaleTimeString()}
                </p>
                <p>
                  updatedAt:
                  {" " +
                    new Date(n.updatedAt).toLocaleDateString() +
                    " " +
                    new Date(n.updatedAt).toLocaleTimeString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        "No notes yet"
      )}
    </div>
  );
};

export default Dashboard;

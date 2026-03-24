import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TrashIcon } from "@phosphor-icons/react";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import AddNote from "@/components/AddNote";
import { notes } from "@/lib/collections";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteNoteAction } from "@/actions/note.action";
import DeleteNote from "@/components/DeleteNote";

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

  return (
    <div>
      <AddNote />
      {listOfNotes.length ? (
        <div className="grid grid-cols-2 items-center justify-center gap-6 p-10 outline-2 outline-dotted outline-blue-300 m-10">
          {listOfNotes.map((n) => (
            <Card className="p-2" key={n._id.toString()}>
              <CardHeader className="uppercase font-heading flex justify-between items-center">
                {n.title}
                <DeleteNote id={n._id.toString()} />
              </CardHeader>
              <CardContent>{n.content}</CardContent>
              <CardFooter className="gap-2">
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

import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
import DeleteNote from "@/components/DeleteNote";
import UpdateNote from "@/components/UpdateNote";

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
                <div className="flex items-center justify-between w-max gap-2">
                  <UpdateNote
                    id={n._id.toString()}
                    title={n.title}
                    content={n.content}
                  />
                  <DeleteNote id={n._id.toString()} />
                </div>
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

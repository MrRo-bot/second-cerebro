import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import AddNote from "@/components/AddNote";
import { notes } from "@/lib/collections";
import { ObjectId } from "mongodb";

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

  console.log(listOfNotes);
  return (
    <div>
      <AddNote />
      {/* <div>{}</div> */}
    </div>
  );
};

export default Dashboard;

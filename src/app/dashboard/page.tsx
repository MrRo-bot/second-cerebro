import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import AddNote from "@/components/AddNote";

const Dashboard = async () => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <AddNote />
    </div>
  );
};

export default Dashboard;

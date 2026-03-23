import { cookies, headers } from "next/headers";

import UserInfo from "@/components/UserInfo";
import { auth } from "@/lib/auth";

const Dashboard = async () => {
  const headerList = await headers();
  const cookieStore = await cookies();

  const sessionTokenFromCookies = cookieStore.get(
    "better-auth.session_token",
  )?.value;

  const session = await auth.api.getSession({
    headers: headerList,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    return (
      <pre>
        Raw session_token cookie:{" "}
        {sessionTokenFromCookies ? "present" : "MISSING"}
        Cookie present? {sessionTokenFromCookies ? "Yes" : "No"}
        Cookie header: {headerList.get("cookie") || "none"}
        Final getSession result: {JSON.stringify(session, null, 2)}
      </pre>
    );
  }

  return (
    <div className="w-full h-full">
      <UserInfo session={session} />
    </div>
  );
};

export default Dashboard;

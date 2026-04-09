"use client";

import { useEffect } from "react";
import { SpinnerBallIcon } from "@phosphor-icons/react";

import AvatarMenu from "@/components/header/AvatarMenu";
import SemanticSearch from "@/components/header/SemanticSearch";
import CreateNote from "@/components/note/CreateNote";

import { useSession } from "@/lib/auth-client";

const UserInfo = () => {
  const { data: session, isPending, refetch } = useSession();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center gap-2">
        <SpinnerBallIcon
          weight="bold"
          className="size-4 animate-spin origin-center "
        />
        <span>Loading user...</span>
      </div>
    );
  }

  return (
    <div className="p-4 border bg-muted/50 flex justify-between items-center">
      <div className="flex gap-2 justify-start items-center">
        <div className="text-xl font-medium">Welcome back!</div>
        <div className="text-blue-500">{session?.user?.name || "User"}</div>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <SemanticSearch />
        <CreateNote />
        <AvatarMenu image={session?.user?.image} name={session?.user?.name} />
      </div>
    </div>
  );
};
export default UserInfo;

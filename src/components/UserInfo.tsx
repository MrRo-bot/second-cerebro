"use client";

import { useEffect } from "react";
import { SpinnerBallIcon } from "@phosphor-icons/react";

import { useSession } from "@/lib/auth-client";
import AvatarMenu from "@/components/AvatarMenu";

export default function UserInfo() {
  const { data: session, isPending, refetch } = useSession();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center gap-2">
        <SpinnerBallIcon className="h-4 w-4 animate-spin" />
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
      <AvatarMenu image={session?.user?.image} name={session?.user?.name} />
    </div>
  );
}

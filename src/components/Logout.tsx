"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Logout = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  return (
    <DropdownMenuItem
      variant="destructive"
      className="cursor-pointer p-0"
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);
        await signOut({
          fetchOptions: {
            onSuccess: async () => {
              router.push("/login");
              router.refresh();
            },
            onRequest: () => {
              setIsPending(false);
              // Optional: alert("Logout failed") or toast
            },
          },
        });
      }}
    >
      {isPending ? "Logging out..." : "Logout"}
    </DropdownMenuItem>
  );
};

export default Logout;

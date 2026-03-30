"use client";

import { useRouter } from "next/navigation";
import { SignOutIcon } from "@phosphor-icons/react";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { renderToast } from "@/lib/utils";

const Logout = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="cursor-pointer w-full h-full flex justify-start items-center m-0 p-2 text-red-500 hover:bg-red-50 transition-all duration-300 ease-in-out"
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: async () => {
              router.push("/login");
              router.refresh();

              renderToast({ status: "success", message: "See you later!" });
            },
            onError: async (ctx) => {
              const errorMessage = ctx.error.message || "Unexpected error";

              renderToast({
                status: "error",
                message: `Logout Failed: ${errorMessage}`,
              });
            },
          },
        });
      }}
    >
      <SignOutIcon weight="bold" className="size-4" /> Logout
    </Button>
  );
};

export default Logout;

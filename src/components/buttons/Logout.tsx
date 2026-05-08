"use client";

import { useRouter } from "next/navigation";
import { SignOutIcon, WarningDiamondIcon } from "@phosphor-icons/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { renderToast } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

const Logout = () => {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer w-full h-full flex justify-start items-center m-0 p-2 text-red-500 hover:bg-red-50 transition-all duration-300 ease-in-out"
        >
          <SignOutIcon weight="bold" className="size-4" /> Logout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg gap-2 text-destructive">
            <WarningDiamondIcon weight="bold" className="size-4" />
            Oh no! You&apos;re leaving 🥹
          </DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer rounded-lg pt-0.5"
            >
              Nah, Just Kidding
            </Button>
          </DialogClose>

          <Button
            className="cursor-pointer rounded-lg"
            variant="destructive"
            onClick={async () => {
              await signOut({
                fetchOptions: {
                  onSuccess: async () => {
                    router.push("/login");
                    router.refresh();

                    renderToast({
                      status: "success",
                      message: "See you later!",
                    });
                  },
                  onError: async (ctx) => {
                    const errorMessage =
                      ctx.error.message || "Unexpected error";

                    renderToast({
                      status: "error",
                      message: `Logout Failed: ${errorMessage}`,
                    });
                  },
                },
              });
            }}
          >
            <SignOutIcon weight="bold" className="size-4" /> Yes, Log Me Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Logout;

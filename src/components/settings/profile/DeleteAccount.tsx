"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon, WarningDiamondIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomLoading from "@/components/CustomLoading";

import { deleteUser } from "@/lib/auth-client";
import { deleteUserAction } from "@/actions/user.action";

import { AccountsType, SessionObjectType } from "@/types/user";

const DeleteAccount = ({
  mySession,
  userAccount,
}: {
  mySession: SessionObjectType;
  userAccount: AccountsType | undefined;
}) => {
  const router = useRouter();

  const [confirmationText, setConfirmationText] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isConfirmTyped =
    confirmationText === "DELETE/" + mySession?.user?.username;

  const handleCredDelete = async () => {
    setIsLoading(true);
    setError("");

    const { error: authError } = await deleteUser({
      password: password,
      callbackURL: "/login",
    });

    if (authError) {
      setError(authError.message || "Incorrect password. Please try again");
      setIsLoading(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  const handleSocialDelete = async () => {
    setIsLoading(true);
    setError("");

    try {
      await deleteUserAction();
    } catch (error) {
      console.error("ERROR_IN_DELETING_ACCOUNT: " + error);
      //@ts-expect-error error object
      setError(error.message || "Failed to delete account. Please try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-2 border-t border-destructive/20">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently remove your account and all associated data. **This cannot
          be undone**
        </p>
      </div>

      {userAccount?.providerId === "credential" ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="flex justify-center" asChild>
            <Button
              variant="destructive"
              className="gap-2 cursor-pointer mx-auto w-max"
            >
              <TrashIcon className="size-4" />
              Delete Account
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle className="flex items-center text-base gap-2 text-destructive">
                <WarningDiamondIcon weight="bold" className="size-4" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="mt-3 text-sm">
                This action is irreversible. All your data will be wiped from
                our database.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {error && (
                <Alert className="bg-amber-50 dark:bg-amber-950">
                  <WarningDiamondIcon weight="bold" className="size-4" />
                  <AlertTitle>Woah!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="password">Enter password to confirm</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Keep My Account
              </Button>

              <Button
                className="cursor-pointer flex items-center justify-center gap-1"
                variant="destructive"
                onClick={handleCredDelete}
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <>
                    <CustomLoading className="scale-70" text="Wiping Data..." />
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog
          open={isOpen}
          onOpenChange={(val) => {
            setIsOpen(val);
            if (!val) {
              setConfirmationText("");
              setError("");
            }
          }}
        >
          <DialogTrigger className="flex justify-center" asChild>
            <Button
              variant="destructive"
              className="gap-2 cursor-pointer mx-auto w-max"
            >
              <TrashIcon className="size-4" />
              Delete Account
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle className="flex items-center text-base gap-2 text-destructive">
                <WarningDiamondIcon weight="bold" className="size-4" />
                Confirm Immediate Deletion
              </DialogTitle>
              <DialogDescription className="mt-3 text-sm">
                All data linked to <strong>{mySession?.user?.email}</strong>,
                including your notes, will be permanently purged from MongoDB.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <WarningDiamondIcon weight="bold" className="size-4" />
                  <AlertTitle>System Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label
                  htmlFor="confirm"
                  className="text-xs font-bold text-muted-foreground line-clamp-2"
                >
                  To confirm, type{" "}
                  <span className="text-destructive text-lg font-black text-shadow-2xs text-shadow-accent">
                    DELETE/{mySession?.user?.username}
                  </span>{" "}
                  below
                </Label>
                <Input
                  id="confirm"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="border-destructive/40 focus-visible:ring-destructive"
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Keep My Account
              </Button>

              <Button
                variant="destructive"
                onClick={handleSocialDelete}
                disabled={isLoading || !isConfirmTyped}
                className="cursor-pointer flex items-center justify-center gap-1"
              >
                {isLoading ? (
                  <>
                    <CustomLoading className="" text="Wiping Data..." />
                  </>
                ) : (
                  "Delete Everything"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default DeleteAccount;

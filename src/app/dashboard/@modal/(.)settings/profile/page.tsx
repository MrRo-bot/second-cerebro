"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProfileAvatar from "@/components/settings/profile/ProfileAvatar";
import Username from "@/components/settings/profile/Username";
import FullName from "@/components/settings/profile/FullName";
import Password from "@/components/settings/profile/Password";
import DateOfBirth from "@/components/settings/profile/DateOfBirth";
import Gender from "@/components/settings/profile/Gender";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import DeleteAccount from "@/components/settings/profile/DeleteAccount";

import { listAccounts, useSession } from "@/lib/auth-client";

import { AccountsType } from "@/types/user";

const ProfileManagement = () => {
  const router = useRouter();

  const { data: mySession, isPending } = useSession();

  const [userAccount, setUserAccount] = useState<AccountsType>();

  useEffect(() => {
    (async () => {
      const accounts = await listAccounts();
      if (accounts.data) {
        setUserAccount({
          ...accounts.data.filter(
            (a) => a.userId === mySession?.session?.userId,
          )[0],
        });
      }
    })();
  }, [mySession?.session?.userId]);

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Manage Profile</DialogTitle>
          <DialogDescription>
            {"Some details are optional, others are necessary"}
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <div className="-mx-4 no-scrollbar h-[50vh] max-h-[60vh] overflow-y-auto px-4 flex-col flex justify-center items-center gap-4">
          {/* profile avatar */}
          <ProfileAvatar
            userAccount={userAccount}
            isPending={isPending}
            mySession={mySession}
          />

          {/* username */}
          <Username mySession={mySession} />
          {/* password */}
          <Password />

          <h3 className="text-left font-heading font-semibold text-sm -mb-3 mt-6 w-full">
            Private Info
          </h3>
          <Separator />

          {/* name */}
          <FullName mySession={mySession} userAccount={userAccount} />
          {/* date of birth */}
          <DateOfBirth mySession={mySession} />
          {/* gender */}
          <Gender mySession={mySession} />
        </div>

        {/* delete account */}
        <DeleteAccount mySession={mySession} userAccount={userAccount} />
        <div className="border-b border-destructive/20" />
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer mx-auto" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileManagement;

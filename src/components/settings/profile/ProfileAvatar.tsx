"use client";

import { useState, useTransition } from "react";
import { CameraIcon } from "@phosphor-icons/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import CustomLoading from "@/components/CustomLoading";

import { AccountsType, SessionObjectType } from "@/types/user";
import { updateProfileImage } from "@/actions/user.action";
import { renderToast } from "@/lib/utils";

const ProfileAvatar = ({
  userAccount,
  isPending,
  mySession,
}: {
  userAccount: AccountsType | undefined;
  isPending: boolean;
  mySession: SessionObjectType;
}) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(mySession?.user?.image || "");
  const [isPendingAction, startTransition] = useTransition();

  const canEdit = userAccount?.providerId === "credential";

  const handleUpdateImage = () => {
    startTransition(async () => {
      const result = await updateProfileImage(url);

      if (result.success) {
        renderToast({
          status: "success",
          message: result.message,
        });
        setOpen(false);
      } else {
        renderToast({
          status: "error",
          message: result.message,
        });
      }
    });
  };

  if (isPending) {
    return (
      <div className="size-20 rounded-full bg-muted animate-pulse mx-auto" />
    );
  }

  return (
    <div onClick={()=>setOpen(true)} className="relative mx-auto w-fit cursor-pointer">
      <Avatar
        className={`relative size-20 ${
          !canEdit ? "pointer-events-none blur-[1px]" : ""
        }`}
      >
        <AvatarImage
          referrerPolicy="no-referrer"
          src={mySession?.user?.image || "https://github.com/shadcn.png"}
          alt={mySession?.user?.username?.slice(0, 2).toUpperCase() || "User"}
        />

        {canEdit && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="absolute right-1 bottom-1 rounded-full bg-white p-1 cursor-pointer hover:bg-gray-300 transition-colors shadow-sm"
              >
                <CameraIcon weight="bold" className="size-5 text-blue-950" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-80 shadow-lg shadow-zinc-800 rounded-lg mt-2">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium font-heading">
                    Update Profile Picture
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Paste a direct image URL
                  </p>
                </div>

                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="col-span-2 h-8"
                      disabled={isPendingAction}
                    />
                  </div>

                  <Separator />

                  {isPendingAction ? (
                    <Button
                      className="cursor-pointer mx-auto w-max flex items-center justify-center gap-2 rounded-lg"
                      variant="destructive"
                      disabled
                    >
                      <CustomLoading
                        className="scale-70"
                        text="Updating..."
                      />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="default"
                      className="w-max mx-auto cursor-pointer rounded-lg"
                      onClick={handleUpdateImage}
                    >
                      Save Image
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
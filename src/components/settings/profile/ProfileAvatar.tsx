import { CameraIcon } from "@phosphor-icons/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { Accounts, SessionType } from "@/types/user";

const ProfileAvatar = ({
  userAccount,
  isPending,
  mySession,
}: {
  userAccount: Accounts | undefined;
  isPending: boolean;
  mySession: SessionType;
}) => {
  return !isPending ? (
    <Avatar
      className={`relative size-32 mx-auto ${userAccount?.providerId !== "credential" ? "pointer-events-none blur-[1px]" : ""}`}
    >
      <>
        <AvatarImage
          referrerPolicy="no-referrer"
          src={mySession?.user?.image || "https://github.com/shadcn.png"}
          alt={mySession?.user?.username?.slice(0, 2).toUpperCase() || "shadcn"}
        />
        <div className="absolute right-1 bottom-1 rounded-full bg-white p-1 cursor-pointer hover:bg-gray-300">
          <CameraIcon weight="bold" className="size-5 text-blue-950" />
        </div>
      </>
    </Avatar>
  ) : (
    <div></div>
  );
};

export default ProfileAvatar;

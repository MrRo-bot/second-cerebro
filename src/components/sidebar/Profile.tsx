import Link from "next/link";
import { UserIcon } from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import Logout from "@/components/buttons/Logout";
import Settings from "@/components/settings/Settings";

const Profile = ({
  image,
  name,
  email,
}: {
  image: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
}) => {
  return (
    <DropdownMenu modal={false} dir="ltr">
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="cursor-pointer h-14">
          <Avatar>
            <AvatarImage
              referrerPolicy="no-referrer"
              src={image ?? "https://github.com/shadcn.png"}
              alt={name ?? "@user"}
            />
            <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex gap-2 flex-col items-start justify-center">
            <p className="font-black font-heading">{name}</p>
            <p className="">{email}</p>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="end" sideOffset={5}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard/settings/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon weight="bold" className="size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Settings />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            {/* Logout button */}
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Profile;

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
import { Skeleton } from "@/components/ui/skeleton";

const Profile = ({
  image,
  name,
  email,
  isOpen,
}: {
  image: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  isOpen: boolean;
}) => {
  return (
    <DropdownMenu modal={false} dir="ltr">
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="cursor-pointer h-14 rounded-lg">
          <Avatar className={isOpen ? "size-8" : "size-4"}>
            {image ? (
              <>
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={image ?? "https://github.com/shadcn.png"}
                  alt={name ?? "@user"}
                />
                <AvatarFallback>
                  {name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </>
            ) : (
              <Skeleton
                className={`rounded-full ${isOpen ? "size-8" : "size-4"}`}
              />
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            {name ? (
              <span className="truncate font-medium font-heading">{name}</span>
            ) : (
              <Skeleton className="h-4 w-10/12 rounded-lg" />
            )}
            {email ? (
              <span className="truncate text-xs mt-1">{email}</span>
            ) : (
              <Skeleton className="h-4 w-full rounded-lg mt-1" />
            )}
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32 rounded-lg backdrop-blur-2xl"
        align="end"
        alignOffset={0}
      >
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
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0"
          >
            {/* Logout dialog */}
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Profile;

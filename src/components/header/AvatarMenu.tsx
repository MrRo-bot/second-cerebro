import { GearFineIcon, UserIcon } from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "@/components/buttons/Logout";
import ThemeToggle from "@/components/theme/ThemeToggle";

const AvatarMenu = ({
  image,
  name,
}: {
  image: string | null | undefined;
  name: string | null | undefined;
}) => {
  return (
    <DropdownMenu modal={false} dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={image ?? "https://github.com/shadcn.png"}
              alt={name ?? "@user"}
            />
            <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-32" align="start" sideOffset={5}>
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon weight="bold" className="size-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <GearFineIcon weight="bold" className="size-4" />
            Settings
          </DropdownMenuSubTrigger>
          {/* Theme option */}
          <ThemeToggle />
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0">
          {/* Logout button */}
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AvatarMenu;

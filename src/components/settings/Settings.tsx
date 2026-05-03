import { GearFineIcon } from "@phosphor-icons/react";

import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/settings/ThemeToggle";
import Security from "@/components/settings/Security";

const Settings = () => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <GearFineIcon weight="bold" className="size-4" /> Settings
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          sideOffset={5}
          className="rounded-xl backdrop-blur-2xl"
        >
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              {/* theme options */}
              <ThemeToggle />
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Security</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              {/* security options */}
              <Security />
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

export default Settings;

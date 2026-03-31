"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuPortal>
      <DropdownMenuSubContent sideOffset={5}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-left">
            Choose Theme
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            dir="ltr"
            value={theme}
            onValueChange={setTheme}
          >
            <DropdownMenuRadioItem value="light">
              Light
              <SunIcon weight="bold" className="size-4 ml-auto" />
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="dark">
              Dark
              <MoonIcon weight="bold" className="size-4 ml-auto" />
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="system">
              System
              <MonitorIcon weight="bold" className="size-4 ml-auto" />
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  );
};

export default ThemeToggle;

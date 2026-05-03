"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuSubContent
      sideOffset={5}
      className="rounded-xl backdrop-blur-2xl"
    >
      <DropdownMenuLabel className="text-left">Choose Theme</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup dir="ltr" value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="light" className="cursor-pointer">
          Light
          <SunIcon weight="bold" className="size-4 ml-auto" />
        </DropdownMenuRadioItem>

        <DropdownMenuRadioItem value="dark" className="cursor-pointer">
          Dark
          <MoonIcon weight="bold" className="size-4 ml-auto" />
        </DropdownMenuRadioItem>

        <DropdownMenuRadioItem value="system" className="cursor-pointer">
          System
          <MonitorIcon weight="bold" className="size-4 ml-auto" />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuSubContent>
  );
};

export default ThemeToggle;

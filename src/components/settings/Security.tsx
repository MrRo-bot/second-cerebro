"use client";

import { DesktopIcon } from "@phosphor-icons/react";

import {
  DropdownMenuItem,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Security = () => {
  return (
    <DropdownMenuSubContent
      sideOffset={5}
      className="rounded-lg backdrop-blur-2xl"
    >
      <Link href="/dashboard/settings/sessions">
        <DropdownMenuItem className="cursor-pointer">
          Active Sessions
          <DesktopIcon weight="bold" className="size-4 ml-auto" />
        </DropdownMenuItem>
      </Link>
    </DropdownMenuSubContent>
  );
};

export default Security;

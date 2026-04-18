"use client";

import Image from "next/image";
import { useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SemanticSearch from "@/components/header/SemanticSearch";
import AvatarMenu from "./Profile";

import { useSession } from "@/lib/auth-client";
import { GraphIcon, HouseIcon } from "@phosphor-icons/react";
import Link from "next/link";

const MainSidebar = () => {
  const { data: session, isPending, refetch } = useSession();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "18rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      {/* Logo */}
      <SidebarHeader className="flex-row gap-2 justify-start items-center">
        <Image src="/logo.webp" alt="second-cerebro" width={24} height={24} />{" "}
        <p className="font-heading font-bold">Second Cerebro</p>
      </SidebarHeader>
      {/* Menu */}
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                className="flex gap-2"
                href={"/dashboard"}
                suppressHydrationWarning={true}
              >
                <HouseIcon className="size-4" weight="bold" /> <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                className="flex gap-2"
                href={"/dashboard/graph"}
                suppressHydrationWarning={true}
              >
                <GraphIcon className="size-4" weight="bold" />{" "}
                <span>Graph</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="p-0 cursor-pointer">
              <SemanticSearch />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      {/* Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {!isPending && (
              <AvatarMenu
                name={session?.user?.name}
                email={session?.user?.email}
                image={session?.user.image}
              />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
export default MainSidebar;

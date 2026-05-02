"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { GraphIcon, HouseIcon } from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import AvatarMenu from "./Profile";
import RandomQuote from "./RandomQuote";

import { useSession } from "@/lib/auth-client";

const MainSidebar = () => {
  const { data: session, refetch } = useSession();

  const { open } = useSidebar();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <Image
                  src="/logo.webp"
                  alt="second-cerebro"
                  width={20}
                  height={20}
                />
                <span className="text-base font-bold font-heading">
                  Second Cerebro
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4 mt-3">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"Home"}>
                  <Link href={"/dashboard"}>
                    <HouseIcon
                      weight="bold"
                      className={`${open ? "size-5!" : ""}`}
                    />
                    <span className="font-heading text-lg">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"Graph"}>
                  <Link href={"/dashboard/graph"}>
                    <GraphIcon
                      weight="bold"
                      className={`${open ? "size-5!" : ""}`}
                    />
                    <span className="font-heading text-lg">Graph</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* random quotes */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>{open && <RandomQuote />}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AvatarMenu
              name={session?.user?.name}
              email={session?.user?.email}
              image={session?.user.image}
              isOpen={open}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default MainSidebar;

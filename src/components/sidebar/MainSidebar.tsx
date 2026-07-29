"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  useSidebar,
} from "@/components/ui/sidebar";

import AvatarMenu from "./Profile";
import RandomQuote from "./RandomQuote";

import { useSession } from "@/lib/auth-client";

const MainSidebar = () => {
  const { data: session, refetch } = useSession();
  const path = usePathname();

  const { open } = useSidebar();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Sidebar
      style={
        {
          "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties
      }
      collapsible="icon"
    >
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="rounded-lg overflow-hidden">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard" className="bg-background/20">
                <Image
                  src="/logo.webp"
                  alt="second-cerebro"
                  width={24}
                  height={24}
                />
                <span
                  className={`${open ? "ml-0" : "ml-1"} font-heading font-black tracking-widest text-base uppercase overflow-visible! flex items-center justify-center gap-1`}
                >
                  <span className="block text-theme-cyan text-shadow-[0_0_3px] text-shadow-theme-cyan/80">
                    Second
                  </span>{" "}
                  <span className="block text-muted-foreground/70">
                    Cerebro
                  </span>
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
                <SidebarMenuButton
                  asChild
                  tooltip={"Home"}
                  isActive={path === "/dashboard"}
                  className={`${path === "/dashboard" && "bg-theme-cyan! text-accent! shadow-[0_0_6px]! shadow-theme-cyan/50!"} rounded-lg shadow-[0_0_0_0.7px] shadow-accent`}
                >
                  <Link href={"/dashboard"} className="bg-background/60">
                    <HouseIcon
                      weight="bold"
                      className={open ? "size-5!" : ""}
                    />
                    <span className="font-heading text-base">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={"Graph"}
                  isActive={path === "/dashboard/graph"}
                  className={`${path === "/dashboard/graph" && "bg-theme-cyan! text-accent! shadow-[0_0_6px]! shadow-theme-cyan/50!"} rounded-lg shadow-[0_0_0_0.7px] shadow-accent`}
                >
                  <Link href={"/dashboard/graph"} className="bg-background/60">
                    <GraphIcon
                      weight="bold"
                      className={open ? "size-5!" : ""}
                    />
                    <span className="font-heading text-base">Graph</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* random quotes */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <RandomQuote isOpen={open} />
          </SidebarGroupContent>
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
    </Sidebar>
  );
};

export default MainSidebar;

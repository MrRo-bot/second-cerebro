import { ReactNode } from "react";

import MainSidebar from "@/components/sidebar/MainSidebar";
import MainHeader from "@/components/header/MainHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = async ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <MainSidebar />
        <main className="relative">
          <MainHeader />

          {children}
          {/* settings overlay */}
          {modal}
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;

import { ReactNode } from "react";

import UserInfo from "@/components/UserInfo";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <header className="w-full h-full">
      <UserInfo />
      {children}
    </header>
  );
};

export default DashboardLayout;

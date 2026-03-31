import { ReactNode } from "react";

import UserInfo from "@/components/header/UserInfo";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header>
        <UserInfo />
      </header>
      <main>{children}</main>
    </>
  );
};

export default DashboardLayout;

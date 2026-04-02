import { ReactNode } from "react";

import UserInfo from "@/components/header/UserInfo";

const DashboardLayout = async ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) => {
  return (
    <>
      <header>
        <UserInfo />
      </header>
      <main>
        {children}
        {/* settings overlay */}
        {modal}
      </main>
    </>
  );
};

export default DashboardLayout;

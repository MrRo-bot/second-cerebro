import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header>
        <h1 className="text-center font-heading text-3xl py-6 tracking-wider">
          Authentication Page
        </h1>
      </header>
      <main className="w-max h-max m-auto">{children}</main>
    </>
  );
};

export default AuthLayout;

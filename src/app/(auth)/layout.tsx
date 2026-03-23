import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto w-max">
      <h1 className="text-center font-heading text-3xl my-6">
        Authentication Page
      </h1>
      {children}
    </div>
  );
};

export default AuthLayout;

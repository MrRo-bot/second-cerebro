import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto w-max">
      <h1 className="text-center font-heading text-3xl my-6 tracking-wider">
        Authentication Page
      </h1>
      {children}
    </div>
  );
};

export default AuthLayout;

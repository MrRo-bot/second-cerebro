import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="relative bg-[#040404] min-h-screen w-full flex justify-center items-center overflow-hidden py-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-full object-fill"
          poster="/preview.webp"
        >
          <source src="/auth_background.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#04040440] z-10" />

        {children}
      </main>
    </>
  );
};

export default AuthLayout;

"use client";
import { SpinnerBallIcon } from "@phosphor-icons/react";

const CustomLoading = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col h-dvh justify-center items-center">
      <div className="w-max text-blue-800 font-heading tracking-widest mx-auto flex justify-center items-center gap-2">
        <SpinnerBallIcon weight="fill" className="text-red-400 animate-spin" />
        {text}
      </div>
    </div>
  );
};

export default CustomLoading;

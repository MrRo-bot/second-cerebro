"use client";

const CustomLoading = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col h-dvh justify-center items-center">
      <div className="w-max font-heading tracking-widest mx-auto flex justify-center items-center gap-2">
        <div className="size-5 relative" suppressHydrationWarning>
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-0 right-0 animate-[colorShade_0.9s_linear_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-0 left-1/2 -translate-x-1/2
      animate-[colorShade_0.9s_linear_0.1s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-0 left-0 animate-[colorShade_0.9s_linear_0.2s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-1/2 -translate-y-1/2 animate-[colorShade_0.9s_linear_0.3s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
      animate-[colorShade_0.9s_linear_0.4s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-1/2 right-0 -translate-y-1/2 animate-[colorShade_0.9s_linear_0.5s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      bottom-0 right-0 animate-[colorShade_0.9s_linear_0.6s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      bottom-0 left-1/2 -translate-x-1/2
      animate-[colorShade_0.9s_linear_0.7s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      bottom-0 left-0 animate-[colorShade_0.9s_linear_0.8s_infinite]
      "
          />
        </div>
        {text}
      </div>
    </div>
  );
};

export default CustomLoading;

"use client";

const CustomLoading = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col h-full justify-center items-center z-100">
      <div className="w-max font-heading tracking-widest mx-auto flex justify-center items-center gap-3 uppercase">
        <div
          className={
            className ? `size-6 relative ${className}` : "size-6 relative"
          }
          suppressHydrationWarning
        >
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-0 right-0 transition-colors ease-in-out animate-[colorShade_0.9s_linear_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-0 left-1/2 -translate-x-1/2
      transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.1s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-0 left-0 transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.2s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-1/2 -translate-y-1/2 transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.3s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
      transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.4s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      top-1/2 right-0 -translate-y-1/2 transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.5s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      bottom-0 right-0 transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.6s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      bottom-0 left-1/2 -translate-x-1/2
      transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.7s_infinite]
      "
          />
          <div
            className="absolute rounded-full size-1 bg-gray-800
      bottom-0 left-0 transition-colors ease-in-out animate-[colorShade_0.9s_linear_0.8s_infinite]
      "
          />
        </div>
        {text}
      </div>
    </div>
  );
};

export default CustomLoading;

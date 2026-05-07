"use client";

const Loader2 = ({ text }: { text: string }) => {
  return (
    <div className="relative w-max overflow-hidden p-0.5 text-foreground font-heading">
      {text}...
      <div className="absolute inset-0 top-0.5 bottom-0.5 animate-[loading_0.8s_linear_infinite_alternate] bg-white/2 backdrop-blur-[48px] before:absolute before:bg-primary before:left-0 before:top-0 before:h-full before:w-1 before:animate-pulse" />
    </div>
  );
};

export default Loader2;

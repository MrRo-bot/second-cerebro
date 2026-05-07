"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const blobs = document.querySelectorAll(".blob");

      blobs.forEach((blob) => {
        const move = () => {
          gsap.to(blob, {
            x: gsap.utils.random(-250, 250, 5, true),
            y: gsap.utils.random(-250, 250, 5, true),
            duration: gsap.utils.random(10, 20),
            ease: "sine.inOut",
            onComplete: move,
          });
        };
        move();
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <main
        ref={containerRef}
        className="relative bg-slate-950 min-h-screen w-full flex justify-center items-center overflow-hidden"
      >
        <div className="blob absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-600 mix-blend-screen blur-[80px] opacity-60" />
        <div className="blob absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-cyan-500 mix-blend-screen blur-[80px] opacity-40" />
        <div className="blob absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-green-500 mix-blend-screen blur-[80px] opacity-50" />
        {children}
      </main>
    </>
  );
};

export default AuthLayout;

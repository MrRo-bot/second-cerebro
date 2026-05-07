"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

const GraphError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    //TODO: MAYBE CAN DO SOMETHING WITH IT
    console.error(error);
  }, [error]);

  return (
    <body className="w-screen min-h-screen overflow-x-hidden overflow-y-auto bg-background">
      <div className="flex flex-col items-center justify-center gap-6 relative w-full min-h-screen p-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-position-[40px_40px] opacity-60 pointer-events-none size-screen" />
        <div className="absolute inset-0 flex items-center justify-center bg-background mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

        <div className="relative z-10 border-border border-solid border-2 bg-background p-6 max-w-2xl w-full">
          {/* corner design */}
          <div className="absolute -top-0.5 -left-0.5 size-8 border-4 border-solid border-t-border border-l-border" />
          <div className="absolute -top-0.5 -right-0.5 size-8 border-4 border-solid border-t-border border-l-border" />
          <div className="absolute -bottom-0.5 -left-0.5 size-8 border-4 border-solid border-t-border border-l-border" />
          <div className="absolute -bottom-0.5 -right-0.5 size-8 border-4 border-solid border-t-border border-l-border" />

          {/* error card */}
          <div className="text-center mb-6">
            <div className="mb-6">
              <div className="inline-block border-solid border-2 border-destructive py-1.5 px-4">
                <h1 className="text-6xl font-semibold text-foreground -tracking-tight m-0">
                  ERROR
                </h1>
              </div>
              <div className="h-0.5 bg-border w-[calc(100%+3rem)] -ml-6 mt-6"></div>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Something went wrong in graph
            </h2>

            <div className="inline-flex items-center gap-2 border-solid border-2 border-border bg-muted py-1.5 px-3 mb-4 wrap justify-center">
              <span className="text-xs text-muted-foreground font-semibold">
                NAME:
              </span>
              <span className="font-heading text-foreground break-all">
                {error.message}
              </span>
            </div>

            <p className="text-foreground max-w-md my-0 mx-auto text-pretty">
              We encountered an unexpected error. Please try again or return to
              the home page. If you&apos;re a developer, you can find more
              information about the error{" "}
              <a
                href="https://better-auth.com/docs/reference/errors/state_mismatch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline"
              >
                here
              </a>
              .
            </p>
          </div>

          <div className="flex gap-3 mt-6 justify-center wrap">
            {/* go home */}
            <Link
              href="/"
              className="border-solid border-2 border-border bg-primary text-primary-foreground px-2.5 pt-1 rounded-none"
            >
              Go Home
            </Link>

            {/* unstable retry */}
            <Button
              className="border-solid border-2 border-border bg-transparent text-primary rounded-none text-nowrap cursor-pointer text-base"
              variant="outline"
              size="lg"
              onClick={() => unstable_retry()}
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </body>
  );
};
export default GraphError;

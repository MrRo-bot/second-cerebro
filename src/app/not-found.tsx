import Link from "next/link";

const NotFound = () => {
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

          {/* not found card */}
          <div className="text-center mb-6">
            <div className="mb-6">
              <div className="inline-block border-solid border-2 border-destructive py-1.5 px-4">
                <h1 className="text-6xl font-semibold text-foreground -tracking-tight m-0">
                  NOT FOUND
                </h1>
              </div>
              <div className="h-0.5 bg-border w-[calc(100%+3rem)] -ml-6 mt-6"></div>
            </div>

            <div className="inline-flex items-center gap-2 border-solid border-2 border-border bg-muted py-1.5 px-3 mb-4 wrap justify-center">
              <span className="text-muted-foreground text-lg">NAME:</span>
              <span className="font-heading text-foreground break-all">
                Resource Not Found
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-center wrap">
            {/* go home */}
            <Link
              href="/"
              className="border-solid border-2 border-border bg-primary text-primary-foreground px-2.5 rounded-none"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </body>
  );
};

export default NotFound;

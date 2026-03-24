"use client";

import { Button } from "@/components/ui/button";

//error is client component only
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-center my-2">Something went wrong!</h2>
        <p className="text-red-400 text-center">
          {error.name + ": " + error.message}
        </p>
        <Button
          className="mx-auto w-max"
          variant="outline"
          onClick={
            // dirty Attempt to recover by re-fetching and re-rendering the segment
            () => unstable_retry()
          }
        >
          Try again
        </Button>
      </div>
    </html>
  );
}

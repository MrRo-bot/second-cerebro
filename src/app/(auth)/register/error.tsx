"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function RegisterError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong is Register!</h2>
      <Button
        variant="outline"
        onClick={
          // dirty Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
      >
        Try again
      </Button>
    </div>
  );
}

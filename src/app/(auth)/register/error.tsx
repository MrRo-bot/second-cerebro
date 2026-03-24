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
    //toast
    // error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center my-2">Something went wrong in sign in</h2>
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
  );
}

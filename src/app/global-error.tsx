"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    //TODO: MAYBE CAN DO SOMETHING WITH IT
    console.error(error);
  }, [error]);
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
          onClick={() => unstable_retry()}
        >
          Try again
        </Button>
      </div>
    </html>
  );
}

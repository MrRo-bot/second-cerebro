"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    //TODO: toast
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center my-2">Something went wrong in dashboard!</h2>
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
  );
}

"use client";

import { useEffect } from "react";

import ErrorBody from "@/components/ErrorBody";
import { normalizeError, renderToast } from "@/lib/utils";

const RegisterError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error('Something went wrong: ',error);
        const info = normalizeError(error);
    renderToast({
      status: "error" as const,
      message: info.message || "Something Went Wrong",
    });
  }, [error]);

  return <ErrorBody error={error} unstable_retry={unstable_retry} />;
};
export default RegisterError;

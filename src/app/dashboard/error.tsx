"use client";

import { useEffect } from "react";

import ErrorBody from "@/components/ErrorBody";
import { normalizeError, renderToast } from "@/lib/utils";

const DashboardError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
    renderToast({status: 'error',message: normalizeError(error).message})
  }, [error]);

  return <ErrorBody error={error} unstable_retry={unstable_retry} />;
};
export default DashboardError;

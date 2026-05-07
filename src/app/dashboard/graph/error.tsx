"use client";

import { useEffect } from "react";

import ErrorBody from "@/components/ErrorBody";

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

  return <ErrorBody error={error} unstable_retry={unstable_retry} />;
};
export default GraphError;

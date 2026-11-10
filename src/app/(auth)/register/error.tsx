"use client";

import { useEffect } from "react";

import ErrorBody from "@/components/ErrorBody";
import { renderToast } from "@/lib/utils";

const RegisterError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
    renderToast({status: 'error',message: error.message})
  }, [error]);

  return <ErrorBody error={error} unstable_retry={unstable_retry} />;
};
export default RegisterError;

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { renderToast } from "@/lib/utils";

const AuthToast = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const authToastTimeout = setTimeout(() => {
      //* params from the hook
      let message = searchParams.get("message");
      let type = searchParams.get("type");

      //* Fallback: If hook is empty, checks window method directly
      if (!message && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        message = urlParams.get("message");
        type = urlParams.get("type");
      }

      if (message && type) {
        //* toast render
        renderToast({ status: type, message });

        //* Clean up the URL
        const cleanUrl = new URLSearchParams(searchParams.toString());
        cleanUrl.delete("message");
        cleanUrl.delete("type");

        const newPath = cleanUrl.toString()
          ? `${pathname}?${cleanUrl.toString()}`
          : pathname;

        replace(newPath);
      }
    }, 300);

    return () => clearTimeout(authToastTimeout);
  }, [searchParams, pathname, replace]);

  return null;
};
export default AuthToast;

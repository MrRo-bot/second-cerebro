"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn, renderToast } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function ConnectivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useOnlineStatus();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skipping the toast on the very first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    renderToast({
      status: !isOnline ? "warning" : "success",
      message: !isOnline ? "☠️ You are now offline" : "🛜 Connection restored",
    });
  }, [isOnline]);

  return (
    <div
      className={cn(
        "transition-all duration-500 min-h-screen",
        !isOnline &&
          "select-none pointer-events-none opacity-60 grayscale-[0.5]",
      )}
    >
      {children}
    </div>
  );
}

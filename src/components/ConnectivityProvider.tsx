"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn, renderToast } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function ConnectivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOnline } = useOnlineStatus();
  const prevOnline = useRef(true);

  useEffect(() => {
    // Compare against the previous value instead of an "initial mount" flag,
    // which misfires under React Strict Mode's double-invoked effects.
    if (prevOnline.current === isOnline) return;
    prevOnline.current = isOnline;

    renderToast({
      status: isOnline ? "success" : "warning",
      message: isOnline ? "🛜 Connection restored" : "☠️ You are now offline",
    });
  }, [isOnline]);

  return (
    <>
      <div
        className={cn(
          "transition-all duration-500 min-h-screen",
          !isOnline &&
            "select-none pointer-events-none opacity-60 grayscale-[0.5]",
        )}
      >
        {children}
      </div>
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center transition-all duration-300",
          isOnline ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="pointer-events-auto rounded-full bg-amber-500/95 px-4 py-2 text-sm font-medium text-black shadow-lg">
          You&apos;re offline. Changes may not save until you reconnect.
        </div>
      </div>
    </>
  );
}

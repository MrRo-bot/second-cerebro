"use client";

import { useState, useEffect, useCallback } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  const checkConnectivity = useCallback(async () => {
    try {
      const res = await fetch("/api/health-check", {
        // HEAD for speed and to save Vercel usage
        method: "HEAD",
        cache: "no-store",
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const updateStatus = async () => {
      const online = navigator.onLine;
      if (!online) {
        setIsOnline(false);
        return;
      }

      // If navigator says online, verifying with server
      const hasInternet = await checkConnectivity();
      setIsOnline(hasInternet);
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Initial check
    updateStatus();

    // Check every 10 seconds to catch "silent" drops
    const interval = setInterval(updateStatus, 10000);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      clearInterval(interval);
    };
  }, [checkConnectivity]);

  return isOnline;
}

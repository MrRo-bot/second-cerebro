"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const PROBE_TIMEOUT_MS = 5_000;
const MIN_PROBE_GAP_MS = 30_000; // throttle for visibility-triggered probes
const RETRY_BASE_MS = 3_000;
const RETRY_MAX_MS = 30_000;

const probe = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch("/api/health-check", {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const verifyRef = useRef<(force?: boolean) => void>(() => {});

  useEffect(() => {
    let cancelled = false;
    let requestId = 0;
    let attempt = 0;
    let lastProbeAt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const clearRetry = () => {
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = undefined;
    };

    const verify = async (force = false) => {
      clearRetry();

      // Browser knows we're offline: no network call needed.
      if (!navigator.onLine) {
        requestId++; // invalidate any in-flight probe
        setIsOnline(false);
        return;
      }

      if (!force && Date.now() - lastProbeAt < MIN_PROBE_GAP_MS) return;
      lastProbeAt = Date.now();

      const id = ++requestId;
      const ok = await probe();
      if (cancelled || id !== requestId) return; // stale result

      setIsOnline(ok);
      if (ok) {
        attempt = 0;
      } else {
        // Probe failed while navigator says online (captive portal, server down):
        // back off instead of hammering.
        const delay = Math.min(RETRY_BASE_MS * 2 ** attempt++, RETRY_MAX_MS);
        retryTimer = setTimeout(() => verify(true), delay);
      }
    };

    verifyRef.current = verify;

    const handleOffline = () => {
      clearRetry();
      requestId++;
      setIsOnline(false);
    };
    const handleOnline = () => verify(true);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") verify();
    };

    // No initial network probe: just trust the browser's signal.
    if (!navigator.onLine) setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      clearRetry();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Call from your API client when a request throws a network error.
  const recheck = useCallback(() => verifyRef.current(true), []);

  return { isOnline, recheck };
};

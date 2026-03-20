"use client";

import { useEffect } from "react";

export function DashboardUsageTracker({
  dashboardId,
  dashboardName,
  enabled,
}: {
  dashboardId: string;
  dashboardName: string;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    const startedAt = Date.now();
    let lastFlushedAt = startedAt;
    let totalMinutesSent = 0;

    const submitUsage = (minutesTracked: number, notes: string) => {
      if (minutesTracked <= 0) return;

      const body = JSON.stringify({
        dashboardId,
        dashboardName,
        eventType: "viewer_session",
        minutesTracked,
        notes,
      });

      try {
        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const blob = new Blob([body], { type: "application/json" });
          navigator.sendBeacon("/api/portal/usage", blob);
          return;
        }
      } catch {
        // Fall through to fetch if sendBeacon is unavailable or fails.
      }

      void fetch("/api/portal/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        // Ignore usage logging failures in the client; the view should remain usable.
      });
    };

    const flushUsage = (forceRemainder = false) => {
      const now = Date.now();
      let minutesTracked = Math.floor((now - lastFlushedAt) / 60000);

      if (forceRemainder && minutesTracked === 0) {
        const totalSessionMs = now - startedAt;
        if (totalSessionMs >= 30_000 && totalMinutesSent === 0) {
          minutesTracked = 1;
        }
      }

      if (minutesTracked <= 0) return;

      lastFlushedAt = now;
      totalMinutesSent += minutesTracked;
      submitUsage(
        minutesTracked,
        `Dashboard session recorded for ${minutesTracked} minute${minutesTracked === 1 ? "" : "s"}.`,
      );
    };

    const intervalId = window.setInterval(() => {
      flushUsage(false);
    }, 60_000);

    const handlePageHide = () => {
      flushUsage(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushUsage(true);
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      flushUsage(true);
    };
  }, [dashboardId, dashboardName, enabled]);

  return null;
}

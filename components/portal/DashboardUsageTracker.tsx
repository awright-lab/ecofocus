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
    let submitted = false;

    const submitUsage = () => {
      if (submitted) return;
      submitted = true;

      const endedAt = Date.now();
      const minutesTracked = Math.max(1, Math.ceil((endedAt - startedAt) / 60000));
      const body = JSON.stringify({
        dashboardId,
        dashboardName,
        eventType: "viewer_session",
        minutesTracked,
        notes: `Dashboard viewed for ${minutesTracked} minute${minutesTracked === 1 ? "" : "s"}.`,
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

    const handlePageHide = () => {
      submitUsage();
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      submitUsage();
    };
  }, [dashboardId, dashboardName, enabled]);

  return null;
}

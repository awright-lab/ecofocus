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

    void fetch("/api/portal/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dashboardId,
        dashboardName,
        eventType: "viewer_opened",
        minutesTracked: 0,
        notes: "Viewer shell opened from portal dashboard route.",
      }),
    }).catch(() => {
      // Ignore usage logging failures in the client; the view should remain usable.
    });
  }, [dashboardId, dashboardName, enabled]);

  return null;
}

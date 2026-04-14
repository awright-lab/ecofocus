"use client";

import { useEffect } from "react";

export function TicketNotificationReadMarker({ ticketId }: { ticketId?: string }) {
  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/portal/tickets/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketId ? { ticketId } : {}),
      signal: controller.signal,
    }).catch(() => {
      // The badge can safely remain unread until the next successful view.
    });

    return () => controller.abort();
  }, [ticketId]);

  return null;
}

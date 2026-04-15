"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function TicketNotificationReadMarker({ ticketId }: { ticketId?: string }) {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/portal/tickets/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketId ? { ticketId } : {}),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { markedCount?: number };
        if ((data.markedCount || 0) > 0) {
          router.refresh();
        }
      })
      .catch(() => {
        // The badge can safely remain unread until the next successful view.
      });

    return () => controller.abort();
  }, [router, ticketId]);

  return null;
}

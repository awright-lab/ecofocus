"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingOrder({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("We’ll check automatically for a minute. Some payment methods take longer to confirm.");
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);
  const check = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    try {
      const response = await fetch("/api/reports/order-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }), cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error("Status unavailable");
      if (result.state !== "pending") router.refresh();
      else setMessage("Payment is still processing. You don’t need to pay again. Keep this private link to check later.");
    } catch { setMessage("We couldn’t check right now. Your order link is still valid—try checking again shortly."); }
    finally { inFlight.current = false; setChecking(false); }
  }, [sessionId, router]);
  useEffect(() => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") { attempts += 1; void check(); }
      if (attempts >= 12) window.clearInterval(timer);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [check]);
  async function copy() {
    try { await navigator.clipboard.writeText(location.href); setCopied(true); }
    catch { setMessage("Bookmark this page so you can return to your order."); }
  }
  return <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
    <p role="status" aria-live="polite" className="leading-relaxed">{message}</p>
    <div className="mt-4 flex flex-wrap gap-4">
      <button onClick={check} disabled={checking} className="rounded-full bg-emerald-700 px-5 py-2.5 font-semibold text-white disabled:opacity-60">{checking ? "Checking payment…" : "Check payment status"}</button>
      <button onClick={copy} className="font-semibold text-emerald-800 underline underline-offset-4">{copied ? "Order link copied" : "Copy private order link"}</button>
    </div>
    <p className="mt-3 text-xs text-slate-500">Your downloads unlock only after payment is confirmed.</p>
  </div>;
}

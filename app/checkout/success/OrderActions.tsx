"use client";

import { useCallback, useEffect, useState } from "react";
import { clearPurchasedCart, type PurchasedCartItem } from "@/lib/report-cart";

type Props = { sessionId: string; reference: string; purchased: PurchasedCartItem[]; emailSent: boolean };

export default function OrderActions({ sessionId, reference, purchased, emailSent }: Props) {
  const [status, setStatus] = useState<"sending" | "sent" | "failed">(emailSent ? "sent" : "sending");
  const [copied, setCopied] = useState(false);
  const sendEmail = useCallback(async () => {
    setStatus("sending");
    try {
      const response = await fetch("/api/reports/order-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) });
      const result = await response.json();
      setStatus(response.ok && result.sent ? "sent" : "failed");
    } catch { setStatus("failed"); }
  }, [sessionId]);

  useEffect(() => {
    try {
      clearPurchasedCart(localStorage, reference, purchased);
      window.dispatchEvent(new Event("ef:cart-updated"));
    } catch { /* Storage restrictions must never block downloads. */ }
    if (!emailSent) void sendEmail();
  }, [reference, purchased, emailSent, sendEmail]);

  async function copyLink() {
    try { await navigator.clipboard.writeText(location.href); setCopied(true); }
    catch { setCopied(false); }
  }
  return <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
    <p role="status" aria-live="polite">{status === "sent" ? "We’ve emailed your private download link to the address you used at checkout." : status === "sending" ? "Sending your private download link to your checkout email…" : "We couldn’t email your link yet. Your downloads are still available above. Save this private page so you can return."}</p>
    {status === "failed" && <button onClick={sendEmail} className="mt-3 font-semibold text-emerald-800 underline underline-offset-4">Try email again</button>}
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <button onClick={copyLink} className="font-semibold text-emerald-800 underline underline-offset-4">{copied ? "Order link copied" : "Copy private order link"}</button>
      <span className="text-xs text-slate-500">Keep this link private—it grants access to your reports.</span>
    </div>
  </div>;
}

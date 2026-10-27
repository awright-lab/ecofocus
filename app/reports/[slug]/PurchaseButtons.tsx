// app/reports/[id]/sections/PurchaseButtons.tsx
"use client";

import { useState } from "react";
import { checkoutPrices } from "@/lib/checkout";
import { useCart } from "@/app/store/cart";

export default function PurchaseButtons({
  priceId,
  title,
}: { priceId?: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const { add, ready } = useCart();
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  // If there is no priceId, don't render anything (and bail out before using it).
  if (!priceId) return null;
  // Narrow to a definite string for TS:
  const pid: string = priceId;

  async function buyNow() {
    setLoading(true);
    setError("");
    try { await checkoutPrices([{ price: pid, quantity: 1 }]); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Checkout failed. Please try again."); }
    finally { setLoading(false); }
  }

  function addToCart() {
    add({ priceId: pid, title, qty: 1 });
    setAdded(true);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        onClick={buyNow}
        disabled={loading || !ready}
        className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300
                   before:content-[''] before:absolute before:inset-0 before:rounded-full
                   before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                   before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0 disabled:opacity-60"
        aria-busy={loading}
      >
        <span className="relative z-10">{loading ? "Redirecting…" : "Buy now"}</span>
      </button>

      <button
        onClick={addToCart}
        disabled={!ready}
        className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
      {error && <p className="w-full text-sm text-red-700" role="alert">{error}</p>}
      {added && <p className="sr-only" role="status">Report added to your cart.</p>}
    </div>
  );
}


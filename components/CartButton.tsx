// components/CartButton.tsx
"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/app/store/cart";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

export default function CartButton() {
  const pathname = usePathname();
  const { ready, items, remove, checkout, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function buy() {
    setLoading(true);
    setError("");
    try { await checkout(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Checkout failed. Please try again."); }
    finally { setLoading(false); }
  }

  if (!pathname?.startsWith("/reports")) return null;

  const count = items.reduce((a, b) => a + b.qty, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!ready}
        className="fixed bottom-6 right-6 z-[55] inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg"
      >
        <i aria-hidden="true" className="ri-shopping-cart-2-line text-base" />
        Cart {count ? `(${count})` : ""}
      </button>

      {open && (
        <Dialog open={open} onClose={setOpen} className="fixed inset-0 z-[110] flex justify-end bg-black/30">
          <DialogPanel className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <DialogTitle className="text-base font-semibold text-gray-900">Your Cart</DialogTitle>
              <button onClick={() => setOpen(false)} className="rounded-full border border-gray-300 px-3 py-1.5 text-sm">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-gray-600">Your cart is empty.</p>
              ) : items.map((i) => (
                <div key={i.priceId} className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{i.title}</div>
                    <div className="text-xs text-gray-600">Qty: {i.qty}</div>
                  </div>
                  <button onClick={() => remove(i.priceId)} className="text-xs text-gray-500 hover:text-gray-900">Remove</button>
                </div>
              ))}
            </div>
            {error && <p className="px-4 text-sm text-red-700" role="alert">{error}</p>}
            <div className="sticky bottom-0 border-t border-gray-200 p-4 flex items-center justify-between">
              <button onClick={clear} className="text-sm text-gray-600 hover:text-gray-900">Clear</button>
              <button
                onClick={buy}
                disabled={loading || !items.length}
                aria-busy={loading}
                className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {loading ? "Opening checkout…" : "Checkout"}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </>
  );
}

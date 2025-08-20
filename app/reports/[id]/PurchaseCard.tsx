// app/reports/[id]/PurchaseCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { startCheckout } from '@/lib/checkout';
import { Lock, Mail } from 'lucide-react';

type Props = {
  id: string;
  price?: number; // made optional for safety
  type?: 'Report' | 'Service';
  contactPath?: string;        // optional override, otherwise /contact?product=...
  primaryMode?: 'auto' | 'buy' | 'contact'; // 'auto' picks based on price/type
  primaryLabel?: string;       // optional override
  secondaryLabel?: string;     // optional override
};

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function PurchaseCard({
  id,
  price,
  type = 'Report',
  contactPath,
  primaryMode = 'auto',
  primaryLabel,
  secondaryLabel = 'Request sample pages',
}: Props) {
  const [loading, setLoading] = useState(false);

  const hasPrice = typeof price === 'number' && Number.isFinite(price);
  const isBuyable = type === 'Report' && hasPrice;
  const mode = primaryMode === 'auto' ? (isBuyable ? 'buy' : 'contact') : primaryMode;

  const contactHref = contactPath ?? `/contact?product=${encodeURIComponent(id)}`;

  const handleBuy = async () => {
    setLoading(true);
    try {
      await startCheckout([{ id, qty: 1 }], { detail: type.toLowerCase() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
      <div className="text-xs font-semibold text-emerald-700/80">{type}</div>
      <div className="mt-2 text-2xl font-bold text-emerald-700">
        {hasPrice ? usd.format(price as number) : 'Contact for pricing'}
      </div>

      {mode === 'buy' ? (
        <button
          type="button"
          onClick={handleBuy}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {primaryLabel ?? (loading ? 'Processing…' : 'Buy now')}
        </button>
      ) : (
        <Link
          href={contactHref}
          className="mt-4 block w-full rounded-full bg-emerald-600 py-2.5 text-center text-white font-semibold hover:bg-emerald-700 transition-colors"
        >
          {primaryLabel ?? 'Schedule discovery'}
        </Link>
      )}

      <Link
        href={contactHref}
        className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
      >
        {secondaryLabel}
      </Link>

      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-emerald-600" />
          Secure checkout via Stripe
        </li>
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-emerald-600" />
          Invoice &amp; receipt emailed instantly
        </li>
      </ul>
    </aside>
  );
}


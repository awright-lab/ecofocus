
// app/reports/[id]/PurchaseCard.tsx
'use client';

import Link from 'next/link';
import { startCheckout } from '@/lib/checkout';
import { Lock, Mail } from 'lucide-react';

export default function PurchaseCard({
  id,
  price,
  type = 'Report',
}: {
  id: string;
  price: number;
  type?: 'Report' | 'Service';
}) {
  return (
    <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
      <div className="text-xs font-semibold text-emerald-700/80">{type}</div>
      <div className="mt-2 text-2xl font-bold text-emerald-700">
        ${price.toLocaleString()}
      </div>

      <button
        onClick={() => startCheckout([{ id, qty: 1 }], { detail: 'report' })}
        className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors"
      >
        Buy now
      </button>

      <Link
        href="/contact"
        className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
      >
        Request sample pages
      </Link>

      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-emerald-600" />
          Secure checkout via Stripe
        </li>
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-emerald-600" />
          Receipt emailed instantly
        </li>
      </ul>
    </aside>
  );
}

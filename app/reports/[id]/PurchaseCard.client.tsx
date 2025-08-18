'use client';

import Link from 'next/link';
import { startCheckout } from '@/lib/checkout';

export default function PurchaseCard({
  productId,
  price,
}: {
  productId: string;
  price: number;
}) {
  return (
    <div className="rounded-2xl border p-5 h-fit sticky top-6 bg-white">
      <div className="text-emerald-700 text-2xl font-bold">
        ${price.toLocaleString()}
      </div>
      <button
        onClick={() =>
          startCheckout([{ id: productId, qty: 1 }], { detail: 'report' })
        }
        className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700"
      >
        Buy now
      </button>
      <Link
        href="/contact"
        className="mt-2 block text-center rounded-full border py-2.5 font-semibold hover:bg-gray-50"
      >
        Contact sales
      </Link>
    </div>
  );
}

// app/reports/[id]/page.tsx
import { CATALOG } from '@/lib/catalog';
import Image from 'next/image';
import Link from 'next/link';
import { startCheckout } from '@/lib/checkout';

export default function ReportDetail({ params }: { params: { id: string } }) {
  const product = CATALOG.find(p => p.id === params.id);
  if (!product || product.category !== 'Reports') {
    return <div className="container mx-auto px-4 py-16">Report not found.</div>;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_380px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          {product.subtitle && <p className="mt-2 text-gray-700">{product.subtitle}</p>}
          {product.img && (
            <div className="mt-6 relative aspect-[16/9] rounded-xl overflow-hidden border">
              <Image src={product.img} alt={product.title} fill className="object-cover" />
            </div>
          )}
          {product.includes?.length ? (
            <ul className="mt-6 grid gap-2 text-sm text-gray-800">
              {product.includes.map(x => <li key={x}>• {x}</li>)}
            </ul>
          ) : null}
        </div>

        <div className="rounded-2xl border p-5 h-fit sticky top-6 bg-white">
          <div className="text-emerald-700 text-2xl font-bold">
            ${product.price.toLocaleString()}
          </div>
          <button
            onClick={() => startCheckout([{ id: product.id, qty: 1 }], { detail: 'report' })}
            className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700"
          >
            Buy now
          </button>
          <Link href="#"
            className="mt-2 block text-center rounded-full border py-2.5 font-semibold hover:bg-gray-50"
          >
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}

// app/offerings/buyin-2025/page.tsx (example)
import { CATALOG } from '@/lib/catalog';
import Link from 'next/link';

export default function BuyInPage() {
  const product = CATALOG.find(p => p.id === 'buyin-2025')!;
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
      <p className="mt-2 text-gray-700">{product.subtitle}</p>
      <div className="mt-6 grid gap-3 text-sm">
        {product.includes?.map(x => <div key={x}>• {x}</div>)}
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/contact" className="rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold hover:bg-emerald-700">
          Schedule discovery call
        </Link>
        <Link href="/custom" className="rounded-full border px-5 py-2.5 font-semibold hover:bg-gray-50">
          Learn more
        </Link>
      </div>
    </section>
  );
}

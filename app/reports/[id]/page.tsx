import { CATALOG } from '@/lib/catalog';
import Image from 'next/image';
import PurchaseCard from './PurchaseCard.client'; // client component

export default async function ReportDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = CATALOG.find((p) => p.id === id);
  if (!product || product.category !== 'Reports') {
    return (
      <section className="container mx-auto px-4 py-16">
        Report not found.
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_380px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          {product.subtitle && (
            <p className="mt-2 text-gray-700">{product.subtitle}</p>
          )}
          {product.img && (
            <div className="mt-6 relative aspect-[16/9] rounded-xl overflow-hidden border">
              <Image
                src={product.img}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          {product.includes?.length ? (
            <ul className="mt-6 grid gap-2 text-sm text-gray-800">
              {product.includes.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Client-side purchase card (Stripe redirect lives here) */}
        <PurchaseCard productId={product.id} price={product.price} />
      </div>
    </section>
  );
}


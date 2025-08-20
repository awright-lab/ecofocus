import Image from "next/image";
import Link from "next/link";
import { CATALOG } from "@/lib/catalog";

export default function SolutionsFeaturedOfferings() {
  const ids = ["buyin-2025", "enhance-2024", "sir-2024"] as const;
  const items = CATALOG.filter(p => ids.includes(p.id as any));

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
      <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">Featured Offerings</h2>
      <p className="mt-2 text-gray-700">
        Program participation and data services tailored to your needs.
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((p) => {
          const isContact =
            (p.purchaseType ?? (p.category === "Reports" ? "direct" : "contact")) === "contact";
          const priceText = typeof p.price === "number" ? `$${p.price.toLocaleString()}` : undefined;

          // Detail destinations: services under /solutions/*, SIR stays under /reports
          const detailsHref =
            p.id === "buyin-2025"
              ? "/solutions/syndicated-study-2025"
              : p.id === "enhance-2024"
              ? "/solutions/data-enrichment"
              : `/reports/${p.id}`;

          return (
            <article
              key={p.id}
              className="group relative rounded-2xl border bg-white/90 shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-[16/9]">
                {p.badge && (
                  <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                    {p.badge}
                  </span>
                )}
                <Image src={p.img} alt={p.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
                <div className="absolute -bottom-4 left-4 z-20">
                  <div className="rounded-xl bg-white shadow-md border px-4 py-2">
                    <span className="text-[11px] text-gray-500">
                      {p.category === "Reports" ? "Report" : "Service"}
                    </span>
                    <div className="text-lg font-bold text-emerald-700 leading-5">
                      {isContact ? (priceText ? `Starting at ${priceText}` : "Contact") : priceText ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-7">
                <h3 className="text-base md:text-lg font-semibold tracking-tight">{p.title}</h3>
                {p.subtitle && <p className="mt-1 text-sm text-gray-700">{p.subtitle}</p>}
                {p.variantNote && <p className="mt-2 text-xs text-gray-600">{p.variantNote}</p>}

                <div className="mt-4 flex gap-2">
                  {isContact ? (
                    <Link
                      href={p.contactPath ?? `/contact?product=${p.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                      {p.ctaLabel ?? "Schedule discovery"}
                    </Link>
                  ) : (
                    <Link
                      href={`/reports/${p.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                      Buy now
                    </Link>
                  )}
                  <Link
                    href={detailsHref}
                    className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


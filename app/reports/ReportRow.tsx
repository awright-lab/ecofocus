"use client";

export type ReportListItem = {
  id: string;
  slug: string;
  title: string;
  year: number;
  price: number; // 0=free
  access: "Free" | "Premium";
  tags?: string[];
  description?: string;
  thumbnail?: string | null;
};

export function ReportRow({ report }: { report: ReportListItem }) {
  const isFree = report.access === "Free" || report.price === 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left: thumbnail + text */}
      <div className="col-span-12 md:col-span-8">
        <div className="flex items-start gap-3">
          {/* Optional thumbnail slab */}
          <div className="hidden sm:block w-20 h-28 rounded-md bg-emerald-100 ring-1 ring-emerald-200" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={[
                  "inline-flex items-center rounded-full text-xs px-2 py-0.5",
                  isFree
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-marigold-100 text-marigold-800",
                ].join(" ")}
              >
                {isFree ? "Free" : "Premium"}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5">
                {report.year}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-emerald-950">{report.title}</h3>

            {report.description && (
              <p className="mt-1 text-sm text-emerald-800/80 line-clamp-2">
                {report.description}
              </p>
            )}

            {report.tags && report.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {report.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 ring-1 ring-emerald-100 text-emerald-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: price + CTAs */}
      <div className="col-span-12 md:col-span-4 md:text-right">
        {isFree ? (
          <div className="text-sm text-emerald-700">No cost</div>
        ) : (
          <>
            <div className="text-sm text-emerald-700">Excl. tax</div>
            <div className="text-2xl font-bold text-emerald-950">
              ${Number(report.price).toLocaleString()}
            </div>
          </>
        )}

        <div className="mt-3 flex md:justify-end gap-2">
          <a
            href={`/reports/${report.slug}`}
            className="px-3 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-900"
          >
            View details
          </a>

          {isFree ? (
            <a
              href={`/reports/${report.slug}`}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Download
            </a>
          ) : (
            <button
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => {
                // Hook into your cart/Stripe flow
                window.dispatchEvent(
                  new CustomEvent("cart:add", { detail: { id: report.id, slug: report.slug } })
                );
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

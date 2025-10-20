import { FadeUp } from "@/components/ui/Reveal";

type Row = {
  pkg: string;
  format: string;
  internal: string;
  external: string;
};

const ROWS: Row[] = [
  {
    pkg: "Totals of Brand questions — For Your Brand Only",
    format: "PowerPoint",
    internal: "Free",
    external: "$1,000",
  },
  {
    pkg: "Totals of Brand questions — For All Brands in the Category",
    format: "PowerPoint",
    internal: "$2,000",
    external: "$2,000",
  },
  {
    pkg: "Totals of Brand questions PLUS Filters — For Your Brand Only",
    format: "Interactive Dashboard",
    internal: "$4,000",
    external: "$8,000",
  },
  {
    pkg: "Totals of Brand questions PLUS Filters — For All Brands in the Category",
    format: "Interactive Dashboard",
    internal: "$6,000",
    external: "$10,000",
  },
  {
    pkg: "Totals of Brand questions PLUS CUSTOM Filters — For Your Brand Only",
    format: "Interactive Dashboard",
    internal: "Contact us for Pricing*",
    external: "Contact us for Pricing*",
  },
  {
    pkg: "Totals of Brand questions PLUS CUSTOM Filters — For All Brands in your Category",
    format: "Interactive Dashboard",
    internal: "Contact us for Pricing*",
    external: "Contact us for Pricing*",
  },
];

export function PricingTable() {
  return (
    <>
      <FadeUp>
        <h2 className="gradient-underline text-2xl font-bold text-slate-900">
          Package Options &amp; Pricing
        </h2>
        <p className="mt-2 text-slate-600">Packages • Access • Methods</p>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <div className="max-h-[640px] overflow-auto rounded-2xl">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_rgba(2,12,27,.06)]">
                <tr className="text-left text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Delivery Format</th>
                  <th className="px-4 py-3">Internal Use</th>
                  <th className="px-4 py-3">External Use With Attribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                {ROWS.map((r) => (
                  <tr key={r.pkg} className="group relative">
                    <td className="px-4 py-4 align-top">
                      <div className="relative">
                        <span className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 transition-opacity group-hover:opacity-90" />
                        {r.pkg}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">{r.format}</td>
                    <td className="px-4 py-4 align-top font-medium">{r.internal}</td>
                    <td className="px-4 py-4 align-top font-medium">{r.external}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.12}>
        <p className="mt-3 text-xs text-slate-500">
          *Custom filter pricing depends on complexity and scope.
        </p>
      </FadeUp>
    </>
  );
}


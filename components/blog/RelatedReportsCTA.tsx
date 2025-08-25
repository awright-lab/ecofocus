import Link from 'next/link';
import { BarChart3, Users, BadgeCheck } from 'lucide-react';


export default function RelatedReportsCTA() {
return (
<section className="mt-16 rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
<div className="grid gap-6 md:grid-cols-2 items-center">
<div>
<h3 className="text-2xl font-semibold text-gray-900">Turn insights into revenue</h3>
<p className="mt-2 text-gray-600">License our Sustainability Dashboard or purchase the 2025 Sustainability Insights Report. Get data your execs can act on this quarter.</p>
<div className="mt-4 flex flex-wrap gap-3">
<Link href="/reports" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white text-sm font-semibold">
<BarChart3 className="h-4 w-4"/> View Reports
</Link>
<Link href="/contact?type=seat-licensing" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900">
<Users className="h-4 w-4"/> Seat Licensing
</Link>
</div>
<ul className="mt-4 text-sm text-gray-700 list-disc list-inside space-y-1">
<li>4,000 US adults; ±1.55% MoE</li>
<li>Interactive crosstabs across 90,000+ data points</li>
<li>Executive-ready visuals and summaries</li>
</ul>
</div>
<div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-md">
<h4 className="text-lg font-semibold">Why teams choose EcoFocus</h4>
<ul className="mt-3 space-y-2 text-white/90 text-sm">
<li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4"/> Validated, census-balanced data</li>
<li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4"/> Clarity over noise—insights, not clutter</li>
<li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4"/> Practical next-steps for GTM & ops</li>
</ul>
</div>
</div>
</section>
);
}
import Link from "next/link";

export default function ReportsBundles() {
  return <section className="mx-auto max-w-7xl px-6 py-14 text-white" aria-labelledby="research-support">
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div><p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Research for your business</p>
        <h2 id="research-support" className="mt-3 text-2xl font-bold sm:text-3xl">Need a broader view?</h2>
        <p className="mt-3 max-w-2xl text-blue-100">Talk with our team about research packages, team licensing, and dashboard access for your organization.</p>
      </div>
      <Link href="/contact" className="shrink-0 self-start rounded-full bg-[#EF9601] px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300">Talk to EcoFocus</Link>
    </div>
  </section>;
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Report } from "./data";

export default function AbstractAndSpecs({ report }: { report: Report }) {
  const r = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="about-this-report">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <motion.div
            initial={r ? false : { opacity: 0, y: 10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <h2 id="about-this-report" className="font-semibold text-gray-900 text-[clamp(1.1rem,3.4vw,1.4rem)]">
              Abstract
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-700">{report.abstract}</p>

            {report.bullets?.length ? (
              <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                {report.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
              {report.sampleHref ? (
                <a
                  href={report.sampleHref}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
                             before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                             before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">Download sample</span>
                </a>
              ) : null}

              <Link
                href={report.purchaseHref || "/contact"}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                {report.purchaseHref ? "Get full report" : "Request full report"}
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={r ? false : { opacity: 0, y: 10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="md:col-span-5"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-semibold text-gray-900">At a glance</h3>
              <dl className="mt-3 divide-y divide-gray-100 text-sm">
                {report.wave ? <SpecRow k="Wave" v={report.wave} /> : null}
                <SpecRow k="Topic" v={report.topic} />
                <SpecRow k="Type" v={report.type} />
                {report.pages ? <SpecRow k="Length" v={`${report.pages} pages`} /> : null}
                {report.length ? <SpecRow k="Length" v={report.length} /> : null}
                {report.format ? <SpecRow k="Format" v={report.format} /> : null}
                <SpecRow k="Year" v={report.year} />
                <SpecRow k="Published" v={new Date(report.date).toLocaleDateString()} />
                <SpecRow k="Exports" v="White-label PNG + CSV (where applicable)" />
                <SpecRow k="License" v="Agency use; org options available" />
              </dl>
              <p className="mt-3 text-xs text-gray-500">
                White-label exports contain no EcoFocus brand colors. Significance and small-base flags are preserved.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      <dt className="col-span-1 text-gray-500">{k}</dt>
      <dd className="col-span-2 font-medium text-gray-900">{v}</dd>
    </div>
  );
}

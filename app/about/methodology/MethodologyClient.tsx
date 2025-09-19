"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

export default function MethodologyClient() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="bg-white">
      {/* Hero: deep slab (no grid) */}
      <section className="relative overflow-hidden section-slab-deep">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-2 text-center text-xs font-semibold uppercase tracking-wider text-emerald-300"
          >
            Technical Overview
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center font-bold leading-tight text-white text-[clamp(1.8rem,5.2vw,2.6rem)]"
          >
            Methodology Agencies Can Defend
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mx-auto mt-3 max-w-2xl text-center text-sm sm:text-base text-white/85"
          >
            A transparent view into how EcoFocus captures and validates sustainability insights—so
            your briefs, POVs, and campaigns are grounded in evidence, not assumptions.
          </motion.p>

          {/* Mini ToC */}
          <motion.nav
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
            aria-label="On this page"
            className="mx-auto mt-6 max-w-3xl"
          >
            <ul className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
              {[
                ["Overview", "#overview"],
                ["Sampling", "#sampling"],
                ["Weighting", "#weighting"],
                ["Quality Controls", "#quality"],
                ["Questionnaire", "#questionnaire"],
                ["Margins & Stats", "#moe"],
                ["Trend Design", "#trends"],
                ["Data Access", "#access"],
                ["Transparency", "#transparency"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-emerald-800 hover:bg-emerald-50"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </section>

      {/* Alternating sections: emerald slabs + white sections (no grid) */}
      <Section id="overview" title="Overview" tint="emerald" slab>
        <p>
          EcoFocus conducts recurring, nationally representative research on U.S. adults (18+),
          tracking attitudes and behaviors tied to sustainability. Each wave combines foundational
          trend measures with topical modules that agencies can apply directly to briefs, creative
          strategy, and go-to-market. Findings are produced with documented methodology, clear
          margins of error, and segmentable outputs suitable for stakeholder scrutiny.
        </p>
        <StatGrid
          items={[
            { label: "Respondents per wave", value: "4,000+" },
            { label: "Years tracking", value: "13+" },
            { label: "Data points", value: "90k+" },
            { label: "National MoE", value: "±1.55%" },
          ]}
        />
      </Section>

      <Section id="sampling" title="Sampling & Frame" icon="ri-community-line" tint="blue">
        <List
          items={[
            "Universe: U.S. adults 18+ (nationally representative).",
            "Sampling: Online panel sources with strict supplier vetting and traffic allocation caps.",
            "Quotas: Balanced to Census benchmarks on age, gender, region, ethnicity, and other key demographics.",
            "Incidence & eligibility: Screeners ensure relevant participation and appropriate base sizes for key segments.",
          ]}
        />
        <Note>
          For sub-audiences (e.g., Gen Z, parents, heavy category users), we oversample as needed to
          enable granular cuts; MoE varies by base size.
        </Note>
      </Section>

      <Section id="weighting" title="Weighting & Representativeness" icon="ri-equalizer-line" tint="emerald" slab>
        <p>
          Final data are weighted to align with U.S. Census distributions using industry-standard
          raking (iterative proportional fitting). Weight variables typically include age, gender,
          region, ethnicity, and education. Additional controls may be applied when a wave includes
          designed oversamples.
        </p>
        <List
          items={[
            "Weights capped to avoid extreme influence from any single respondent.",
            "Deliverables include unweighted base sizes and weighted percentages.",
            "Segment cuts include both weighted reads and guidance on minimum base sizes.",
          ]}
        />
      </Section>

      <Section id="quality" title="Fieldwork Quality & Fraud Controls" icon="ri-shield-check-line" tint="blue">
        <List
          items={[
            "Multi-step respondent verification via panel partners; device, geo, and duplication checks.",
            "Speeding and straight-line detection; attention/logic checks embedded throughout.",
            "Bot/fraud screening using pattern analysis and open-end quality review.",
            "Supplier mix management with allocation caps and performance monitoring.",
          ]}
        />
        <Note>
          Respondents failing quality criteria are removed and replaced to preserve quotas and sample
          balance.
        </Note>
      </Section>

      <Section id="questionnaire" title="Questionnaire Governance" icon="ri-file-text-line" tint="emerald" slab>
        <List
          items={[
            "Core tracker: stable constructs to preserve trend integrity (wording and order locked, barring methodological reviews).",
            "Topical modules: rotating topics designed for current market questions (e.g., packaging claims, values language, pricing tolerance).",
            "Pilot & timing checks ensure clarity and realistic survey length.",
            "Accessibility and plain-language reviews reduce respondent burden and bias.",
          ]}
        />
      </Section>

      <Section id="moe" title="Margins of Error & Statistical Interpretation" icon="ri-bar-chart-2-line" tint="blue">
        <p>
          For national totals at n≈4,000, the approximate margin of error is ±1.55% at 95% confidence.
          Segment MoE depends on base size and should be considered when interpreting differences. We
          provide guidance tables and flag small-base reads in deliverables.
        </p>
        <List
          items={[
            "Report both absolute percentages and key deltas relative to prior waves.",
            "Highlight directionally consistent shifts across related metrics.",
            "Avoid over-interpreting differences within the MoE; validate with additional waves or qual.",
          ]}
        />
      </Section>

      <Section id="trends" title="Trend Design (Since 2010)" icon="ri-timer-line" tint="emerald" slab>
        <p>
          The tracker emphasizes construct stability to enable like-for-like comparisons across time.
          When improvements are required (e.g., clarity, modernized terminology), we employ split-sample
          bridges or parallel measures to preserve continuity.
        </p>
        <List
          items={[
            "Version control across waves with change logs.",
            "Bridge studies when altering core wording or scales.",
            "Annotated trend charts noting methodological changes.",
          ]}
        />
      </Section>

      <Section id="access" title="Data Access & Integrations" icon="ri-database-2-line" tint="blue">
        <p>
          Agencies can access findings through interactive dashboards, exports for decks/briefs, or via
          secure data deliveries for BI integration. We support merges with client data to sharpen
          personas, forecast shifts, and validate claims before launch.
        </p>
        <List
          items={[
            "Interactive dashboard: filters, charting, export to image/CSV.",
            "CSV/Parquet deliveries for analysts; schema docs included.",
            "S3/R2-style bucket support; optional API access for enterprise.",
            "Join keys and data dictionaries provided for safe merges.",
          ]}
        />
      </Section>

      <Section id="transparency" title="Transparency & Technical Documentation" icon="ri-article-line" tint="emerald" slab>
        <p>
          We document questionnaire versions, sampling/weighting specs, supplier mixes, and quality
          thresholds each wave. Technical appendices and data dictionaries are available to agency and
          brand clients on request.
        </p>

        <DownloadRow
          items={[
            { label: "Technical Appendix (PDF)", href: "/files/methodology/technical-appendix.pdf" },
            { label: "Questionnaire (PDF)", href: "/files/methodology/questionnaire.pdf" },
            { label: "Data Dictionary (CSV)", href: "/files/methodology/data-dictionary.csv" },
          ]}
        />

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Book an Agency Briefing
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Back to About
          </Link>
        </div>
      </Section>
    </main>
  );
}

/* ---------- Reusable UI bits with surface control (no grid) ---------- */

function Section({
  id,
  title,
  icon,
  tint,            // 'emerald' | 'blue' | undefined
  slab = false,    // bold emerald slab
  children,
}: {
  id: string;
  title: string;
  icon?: string;
  tint?: "emerald" | "blue";
  slab?: boolean;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  // Map tint + slab to backgrounds
  const bg =
    slab && tint === "emerald"
      ? "section-slab-emerald"
      : tint === "emerald"
      ? "bg-brand-tint-emerald"
      : tint === "blue"
      ? "bg-white" // keep high contrast vs emerald slabs
      : "bg-white";

  const isDark = slab && tint === "emerald";

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative scroll-mt-24 ${bg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-center gap-3 text-center"
        >
          {icon ? (
            <i
              className={`${icon} text-xl ${isDark ? "text-emerald-300" : "text-emerald-600"}`}
              aria-hidden="true"
            />
          ) : null}
          <h2
            id={`${id}-title`}
            className={`font-bold leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            } text-[clamp(1.4rem,4.6vw,2.0rem)]`}
          >
            {title}
          </h2>
        </motion.div>
        <div className={`mx-auto max-w-3xl ${isDark ? "text-white/85" : "text-gray-700"}`}>{children}</div>
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul role="list" className="mt-4 space-y-2.5 text-sm">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
      {children}
    </div>
  );
}

function StatGrid({ items }: { items: { label: string; value: string }[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.06 }}
      className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-4"
    >
      {items.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          <div className="mt-0.5 text-xs text-gray-600">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

function DownloadRow({ items }: { items: { label: string; href: string }[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {items.map((d) => (
        <a
          key={d.href}
          href={d.href}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm hover:bg-emerald-50"
        >
          <span>{d.label}</span>
          <i className="ri-download-2-line text-lg text-emerald-600" aria-hidden="true" />
        </a>
      ))}
    </motion.div>
  );
}



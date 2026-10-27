import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getReportBySlug } from "@/lib/reports-repo";

import CoverHero from "./CoverHero";

const SITE_URL = "https://ecofocusresearch.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReportBySlug(slug);
  const canonical = `/reports/${slug}`;

  if (!report) {
    return {
      title: { absolute: "Report not found | EcoFocus Research" },
      description: "The requested report could not be found.",
      alternates: { canonical },
      robots: { index: false, follow: false },
    };
  }

  const title = `${report.title} | EcoFocus Research`;
  const description =
    report.subtitle ||
    "EcoFocus sustainability report with segmentable insights and ready-to-use proof points.";
  const ogImage = report.cover
    ? new URL(report.cover, SITE_URL).toString()
    : `${SITE_URL}/images/og/og-reports.png`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      type: "article",
      siteName: "EcoFocus Research",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: report.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // <-- your project expects a Promise
}) {
  const { slug } = await params;     // <-- await it
  const report = await getReportBySlug(slug);

  if (!report) notFound();

  return (
    <>
      <Header />
      <main className="bg-white pt-14 text-gray-900 md:pt-20">
        <CoverHero report={report} />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Reports", href: "/reports" },
            { label: report.title },
          ]}
          maxWidth="max-w-7xl"
        />

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16" aria-labelledby="report-overview">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">A closer look</p>
            <h2 id="report-overview" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">About this report</h2>
            <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-slate-600">
              {(report.body || report.description || "Contact our team for more information about this report.").split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}
            </div>
          </div>
          <aside className="self-start rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8" aria-labelledby="report-details">
            <h2 id="report-details" className="text-lg font-semibold text-slate-900">Report details</h2>
            <dl className="mt-5 divide-y divide-emerald-100 text-sm">
              {[["Year", report.year], ["Topic", report.topic], ["Study wave", report.wave], ["Format", report.format], ["Length", report.pages ? `${report.pages} pages` : undefined]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="flex justify-between gap-5 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-800">{value}</dd></div>)}
            </dl>
            <div className="mt-6 border-t border-emerald-100 pt-6">
              <h3 className="font-semibold text-slate-900">Need help choosing?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Talk with our team about this report, licensing, or research for your organization.</p>
              <a href="/contact" className="mt-4 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4">Talk to EcoFocus</a>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}














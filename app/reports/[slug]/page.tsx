import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getReportBySlug } from "@/lib/reports-repo";

import CoverHero from "./CoverHero";
import PurchaseButtons from "./PurchaseButtons";
import FreeGateButton from "./FreeGateButton";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // <-- your project expects a Promise
}) {
  const { slug } = await params;     // <-- await it
  const report = await getReportBySlug(slug);

  if (!report) {
    return (
      <>
        <Header />
        <main className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
            <h1 className="text-2xl font-bold text-gray-900">Report not found</h1>
            <p className="mt-2 text-gray-700">Please go back and try again.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <CoverHero report={report} />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Reports", href: "/reports" },
            { label: report.title },
          ]}
          maxWidth="max-w-7xl"
        />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
              <p className="mt-2 text-sm text-gray-700">
                {report.subtitle || "A focused EcoFocus analysis with segmentable reads and agency-ready outputs."}
              </p>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900">What’s inside</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
                  <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" /> Methods, sample, and key segments</li>
                  <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" /> Findings with trend context (where applicable)</li>
                  <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" /> White-label charts for decks and POVs</li>
                </ul>
              </div>
            </div>

            <aside className="md:col-span-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  {report.wave && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{report.wave}</span>}
                  {report.topic && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{report.topic}</span>}
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{report.year}</span>
                  {report.pages && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{report.pages} pp</span>}
                  {report.format && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{report.format}</span>}
                </div>

                {report.access === "Premium" ? (
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900">{report.priceDisplay ?? ""}</div>
                    <PurchaseButtons priceId={report.priceId} title={report.title} />
                  </div>
                ) : (
                  <div className="mt-4">
                    <FreeGateButton fileHref={report.freeHref!} />
                    {report.sampleHref && (
                      <a
                        href={report.sampleHref}
                        className="ml-2 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Sample
                      </a>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}














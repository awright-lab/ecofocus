import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getReportBySlug } from "@/lib/reports-repo";

import ReportContent from "./ReportContent";

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
    report.description || report.subtitle ||
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
      <ReportContent report={report} />
      <Footer />
    </>
  );
}














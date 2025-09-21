import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";

import { REPORTS, Report } from "./data";

import CoverHero from "./CoverHero";
import AbstractAndSpecs from "./AbstractAndSpecs";
import PreviewCarousel from "./PreviewCarousel";
import ReportCTA from "./ReportCTA";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const r = REPORTS[params.id];
  if (!r) return {};
  const title = `${r.title} | EcoFocus Reports`;
  const description = r.subtitle || r.abstract || "EcoFocus syndicated report.";
  const ogImg = r.cover || "/og-image.jpg";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: r.title }],
      type: "article" as const,
    },
  };
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const report: Report | undefined = REPORTS[params.id];
  if (!report) return notFound();

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

        <AbstractAndSpecs report={report} />
        <PreviewCarousel report={report} />
        <ReportCTA report={report} />
      </main>
      <Footer />
    </>
  );
}










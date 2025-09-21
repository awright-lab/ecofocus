// app/reports/[id]/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { REPORTS, type Report } from "./data";

import CoverHero from "./CoverHero";
import AbstractAndSpecs from "./AbstractAndSpecs";
import PreviewCarousel from "./PreviewCarousel";
import ReportCTA from "./ReportCTA";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const r = REPORTS[id];
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
      type: "article",
    },
  };
}

// Also async here to await params
export default async function ReportDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report: Report | undefined = REPORTS[id];
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











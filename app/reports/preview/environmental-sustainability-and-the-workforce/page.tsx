import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportContent from "@/app/reports/[slug]/ReportContent";
import draft from "@/content/report-drafts/environmental-sustainability-and-the-workforce.json";

export const metadata: Metadata = {
  title: { absolute: "Preview: Environmental Sustainability and the Workforce | EcoFocus Research" },
  robots: { index: false, follow: false },
};

export default function WorkforcePreview() {
  return <><Header /><ReportContent preview report={{
    ...draft,
    id: "workforce-preview",
    access: "Premium",
    cover: "/images/employment-report-cover.png",
    priceId: undefined,
  }} /><Footer /></>;
}

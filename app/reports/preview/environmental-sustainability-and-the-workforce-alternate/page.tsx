import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportContent from "@/app/reports/[slug]/ReportContent";
import alternate from "@/content/report-previews/workforce-alternate.json";

export const metadata: Metadata = {
  title: { absolute: "Alternate preview: Environmental Sustainability and the Workforce | EcoFocus Research" },
  robots: { index: false, follow: false },
};

export default function WorkforceAlternatePreview() {
  return <><Header /><ReportContent preview presentation={alternate.presentation} report={{
    ...alternate.report,
    id: "workforce-alternate-preview",
    access: "Premium",
    cover: "https://ecofocus-cms.onrender.com/api/media/file/environmental-sustainability-and-the-workforce-cover-v6-1.webp",
    priceId: undefined,
  }} /><Footer /></>;
}

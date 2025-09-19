import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MethodologyClient from "./MethodologyClient";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How EcoFocus captures and validates sustainability insights—sampling, weighting, quality controls, and trend design.",
  alternates: { canonical: "/about/methodology" },
  openGraph: { url: "/about/methodology" },
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <MethodologyClient />
      <Footer />
    </>
  );
}




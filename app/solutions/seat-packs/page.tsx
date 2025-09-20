"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import SeatPacksHero from "./SeatPacksHero";
import SeatPacksPricing from "./SeatPacksPricing";
import SeatPacksFeatures from "./SeatPacksFeatures";
import SeatPacksFAQ from "./SeatPacksFAQ";

export default function SeatPacksPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <SeatPacksHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Seat Packs" },
          ]}
          maxWidth="max-w-7xl"
        />

        <SeatPacksPricing />
        <SeatPacksFeatures />
        <SeatPacksFAQ />
      </main>
      <Footer />
    </>
  );
}

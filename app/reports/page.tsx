// app/reports/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import ReportsHero from "./ReportsHero";
import ReportsFilters from "./ReportsFilters";
import AccessTabs from "./AccessTabs";
import ReportsGrid from "./ReportsGrid";
import ReportsBundles from "./ReportsBundles";
import ReportsCTA from "./ReportsCTA";

import { listReports } from "@/lib/reports-repo";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = {
    q: (sp.q as string) || "",
    year: (sp.year as string) || "All",
    topic: (sp.topic as string) || "All",
    type: (sp.type as string) || "All",
    access: (sp.access as "All" | "Free" | "Premium") || "All",
    sort: (sp.sort as "Newest" | "A–Z") || "Newest",
    limit: Number(sp.limit ?? 24),
    cursor: (sp.cursor as string) || undefined,
  };

  const initial = await listReports(query);

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <ReportsHero />

        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Reports" }]}
          maxWidth="max-w-7xl"
        />

        <ReportsFilters />
        <AccessTabs />
        <ReportsGrid initial={initial} query={query} />

        <ReportsBundles />
        <ReportsCTA />
      </main>
      <Footer />
    </>
  );
}























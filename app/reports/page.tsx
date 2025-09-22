// app/reports/page.tsx
import { Suspense } from "react";
import ReportsPageClient from "./ReportsPageClient"; // client body
import AccessTabs from "./AccessTabs";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <>
      <AccessTabs />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 text-emerald-800">Loading reports…</div>}>
        <ReportsPageClient />
      </Suspense>
    </>
  );
}
































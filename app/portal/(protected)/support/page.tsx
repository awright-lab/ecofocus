import Link from "next/link";
import { CircleHelp, LifeBuoy, Ticket } from "lucide-react";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalArticles } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Support Center",
  "Private support hub for the EcoFocus portal.",
);

const categories = ["Login / Access", "Dashboard Navigation", "Chart Export", "Data Question", "Possible Bug", "Feature Request"];

export default async function PortalSupportPage() {
  await requirePortalAccess("/portal/support");
  const articles = getPortalArticles().slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Support Center"
          title="Help, tickets, and escalation guidance"
          description="Start with help articles for common questions, then submit or track support requests when access, export, or interpretation issues need direct assistance."
        />
        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_100%)] p-6 text-white">
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85">
            Browse the knowledge base to search help content by topic, dashboard name, export type, or common issue.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/portal/support/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
              Submit a Support Request
            </Link>
            <Link href="/portal/support/tickets" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white">
              View My Tickets
            </Link>
            <Link href="/portal/help" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white">
              Browse Help Center
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Common issue categories</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span key={category} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                {category}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-[24px] bg-slate-50 p-5">
            <h4 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <LifeBuoy className="h-4 w-4 text-emerald-700" />
              Contact and escalation guidance
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use standard tickets for access, export, and interpretation support. For urgent client deliverable blockers, include timing,
              business impact, and the specific dashboard or project context in the first message.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Helpful articles</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {articles.map((article) => (
              <Link key={article.id} href={`/portal/help/${article.slug}`} className="rounded-[24px] bg-slate-50 p-4 transition hover:bg-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <CircleHelp className="h-3.5 w-3.5" />
                  <span>{article.category}</span>
                </div>
                <h4 className="mt-3 text-base font-semibold text-slate-900">{article.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 p-4 text-sm text-slate-600">
            Support requests are reviewed by the EcoFocus team and routed based on the issue type, urgency, and dashboard context you provide.
            <Ticket className="ml-2 inline h-4 w-4" />
          </div>
        </div>
      </section>
    </div>
  );
}

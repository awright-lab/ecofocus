import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalArticleBySlug, getPortalArticles } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getPortalArticleBySlug(slug);

  return buildPortalMetadata(
    article ? article.title : "Help Article",
    article ? article.summary : "Private EcoFocus portal help content.",
  );
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await requirePortalAccess("/portal/help");
  const { slug } = await params;
  const article = getPortalArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = getPortalArticles()
    .filter((candidate) => candidate.slug !== article.slug && candidate.category === article.category)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeader
            eyebrow={article.category}
            title={article.title}
            description={article.summary}
          />
          <Link href="/portal/help" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="space-y-5">
            {article.content.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Need more help?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              If this article does not resolve your issue, submit a support request with the dashboard name, page, and steps that led to the problem.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Submit Support Request
              </Link>
              <Link href="/portal/support" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                Visit Support Center
              </Link>
            </div>
          </div>

          {relatedArticles.length ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-950">Related articles</h3>
              <div className="mt-4 space-y-3">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={`/portal/help/${related.slug}`} className="block rounded-[24px] bg-slate-50 p-4 transition hover:bg-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{related.category}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{related.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{related.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

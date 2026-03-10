import type { PortalHelpArticle } from "@/lib/portal/types";

export function HelpArticleCard({ article }: { article: PortalHelpArticle }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5">
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        {article.category}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{article.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {article.content}
      </div>
    </article>
  );
}

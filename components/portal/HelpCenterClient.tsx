"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { HelpArticleCard } from "@/components/portal/HelpArticleCard";
import type { PortalHelpArticle } from "@/lib/portal/types";
import { cx } from "@/lib/utils";

export function HelpCenterClient({
  articles,
  categories,
}: {
  articles: PortalHelpArticle[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const inCategory = activeCategory === "All" || article.category === activeCategory;
      const haystack = `${article.title} ${article.summary} ${article.content}`.toLowerCase();
      const inQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      return inCategory && inQuery;
    });
  }, [activeCategory, articles, query]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5">
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search login, exports, EcoReputation™, filters, or data tables"
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cx(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    activeCategory === category
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Results</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{filteredArticles.length}</p>
            <p className="mt-2 text-sm text-slate-700">
              {activeCategory === "All"
                ? "Articles matching your current search."
                : `Articles in ${activeCategory} matching your current search.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredArticles.map((article) => (
          <HelpArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

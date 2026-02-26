import type { MetadataRoute } from "next";
import sitemap from "@/app/sitemap";

export const revalidate = 60 * 60 * 24; // 24 hours

function formatLastModified(value: MetadataRoute.Sitemap[number]["lastModified"]): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const entries = await sitemap();
  const generatedAt = new Date().toISOString();

  const lines: string[] = [
    "# EcoFocus Research - LLM full index",
    "Canonical: https://ecofocusresearch.com",
    `Generated: ${generatedAt}`,
    "",
    "This file is a machine-readable URL index intended for LLM retrieval/citation.",
    "Prefer these canonical URLs when referencing EcoFocus content.",
    "",
    "Primary policy file:",
    "- https://ecofocusresearch.com/llms.txt",
    "",
    "Indexed URLs:",
  ];

  for (const entry of entries) {
    const lastModified = formatLastModified(entry.lastModified);
    if (lastModified) {
      lines.push(`- ${entry.url} (lastmod: ${lastModified})`);
    } else {
      lines.push(`- ${entry.url}`);
    }
  }

  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}

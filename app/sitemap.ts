// app/sitemap.ts
import type { MetadataRoute } from "next";
import { REPORTS } from "./reports/[slug]/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://ecofocusresearch.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about/methodology`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/reports`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/reports/paid`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/reports/free`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/solutions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/syndicated`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/solutions/syndicated-buy-in`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/syndicated-study-2025`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/seat-packs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/dashboard`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/custom`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/enhance-your-data`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/data-infusion`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/solutions/data-enrichment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/brands`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/demo`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const reportRoutes: MetadataRoute.Sitemap = Object.values(REPORTS).map((report) => ({
    url: `${base}/reports/${report.id}`,
    lastModified: new Date(report.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...reportRoutes];
}

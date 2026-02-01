// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://ecofocusresearch.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow obvious noise (adjust to your routes)
      disallow: ["/api/", "/admin", "/dashboard", "/portal"],
    },
    sitemap: [`${base}/sitemap.xml`],
  };
}

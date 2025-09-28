// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://www.ecofocusworldwide.com"; // <-- UPDATE
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow obvious noise (adjust to your routes)
      disallow: ["/api/", "/admin", "/dashboard"],
    },
    sitemap: [`${base}/sitemap.xml`],
  };
}

// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://ecofocusresearch.com";
  const disallow = ["/api/", "/admin", "/dashboard", "/portal"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        // Explicit AI crawler policy. Keep public pages discoverable but block private/system paths.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow,
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
  };
}

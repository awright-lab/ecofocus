// components/StoreHero.tsx
"use client";

import Hero from "@/components/Hero";

export default function StoreHero() {
  // Breadcrumb JSON-LD (preserved)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ecofocusresearch.netlify.app/" },
      { "@type": "ListItem", position: 2, name: "Reports & Store", item: "https://ecofocusresearch.netlify.app/reports" },
    ],
  };

  return (
    <>
      <Hero
        variant="solutions"
        size="normal" // compact height
        badge="Storefront"
        headline={
          <>
            Sustainability intelligence,<br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              ready to use
            </span>
          </>
        }
        subhead={
          <>
            Explore the full Sustainability Insights Report or choose focused sections.
            Eligible purchases include read-only dashboard access.
          </>
        }
        ctaPrimary={{ label: "Browse Reports", href: "/reports#catalog" }}
        ctaSecondary={{ label: "Get in Touch", href: "/contact" }}
        // Reuse the SAME abstract lines video for sitewide cohesion + caching
        videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
        posterSrc="/images/storefront-hero-poster.jpg"
        overlay="dense" // heavier tint than Home
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}


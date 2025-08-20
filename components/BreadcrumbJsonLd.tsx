// server or client-safe; keep it simple
export default function BreadcrumbJsonLd({
    items,
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ecofocusresearch.netlify.app',
  }: {
    items: { name: string; href: string }[];
    baseUrl?: string;
  }) {
    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((it, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": it.name,
        "item": `${baseUrl}${it.href}`,
      })),
    };
  
    return (
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }
  
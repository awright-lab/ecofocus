// components/newsletter/SubscribeStrip.tsx
"use client";

import NewsletterForm from "@/components/newsletter/NewsletterForm";

export default function SubscribeStrip() {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Get EcoFocus Insights in your inbox
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Articles, trend callouts, and report highlights. No spam—unsubscribe anytime.
      </p>

      {/* Custom, brand-styled form (posts to /api/hubspot/newsletter) */}
      <div className="mt-4">
        <NewsletterForm />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        We’ll email you EcoNuggets. See our{" "}
        <a href="/legal#privacy-policy" className="underline">Privacy Policy</a>.
      </p>
    </section>
  );
}



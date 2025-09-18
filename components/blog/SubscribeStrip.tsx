// components/blog/SubscribeStrip.tsx
// components/newsletter/SubscribeStrip.tsx
"use client";

import HubSpotForm from "@/components/integrations/HubSpotForm";

export default function SubscribeStrip() {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Get EcoFocus Insights in your inbox
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Articles, trend callouts, and report highlights. No spam—unsubscribe anytime.
      </p>

      <div className="mt-4">
        {/* Uses env defaults; you can also pass formId="fa67e7c1-10e9-4d8a-a397-d124d9277c0a" explicitly */}
        <HubSpotForm targetClassName="hs-wrapper" />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        We use HubSpot to manage subscriptions. By subscribing, you acknowledge HubSpot’s{" "}
        <a
          href="https://legal.hubspot.com/privacy-policy"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          privacy policy
        </a>
        .
      </p>
    </section>
  );
}


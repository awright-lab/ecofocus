// components/blog/SubscribeStrip.tsx
"use client"

import HubSpotForm from "@/components/intergrations/HubSpotForm"

export default function SubscribeStrip() {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Get EcoFocus Insights in your inbox</h3>
      <p className="mt-1 text-sm text-gray-600">
        Articles, trend callouts, and report highlights. No spam—unsubscribe anytime.
      </p>

      {/* HubSpot embed renders here */}
      <div className="mt-4">
        <HubSpotForm targetClassName="mt-2" />
      </div>

      {/* Optional trust microcopy */}
      <p className="mt-3 text-xs text-gray-500">
        We use HubSpot to manage subscriptions. By subscribing, you acknowledge HubSpot’s{" "}
        <a href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noreferrer" className="underline">
          privacy policy
        </a>
        .
      </p>
    </section>
  )
}

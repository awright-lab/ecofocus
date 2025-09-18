// components/newsletter/NewsletterBox.tsx
"use client";

import HubSpotForm from "@/components/integrations/HubSpotForm";

export default function NewsletterBox() {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Get EcoFocus insights</h3>
      <p className="mt-1 text-sm text-gray-600">
        Subscribe to our newsletter for the latest research.
      </p>
      <div className="mt-4">
        {/* Uses env defaults; pass a formId prop here if you want to override */}
        <HubSpotForm targetClassName="hs-wrapper" />
      </div>
    </div>
  );
}


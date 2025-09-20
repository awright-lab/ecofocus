"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How are seats counted?",
    a: "One seat equals one named user with dashboard access. You can reassign seats as team members change.",
  },
  {
    q: "Can we add seats mid-cycle?",
    a: "Yes. We’ll prorate additional seats for the remainder of your term.",
  },
  {
    q: "Does an agency license include seats?",
    a: "Syndicated Study agency licenses include a base number of seats. Seat Packs add more access for broader teams.",
  },
  {
    q: "Do you support SSO?",
    a: "Single sign-on is available on Studio and Enterprise (and as an add-on for eligible Team plans).",
  },
  {
    q: "What about security and DPAs?",
    a: "We support security reviews and data-processing agreements on Enterprise. Talk to us about your requirements.",
  },
];

export default function SeatPacksFAQ() {
  return (
    <section className="relative bg-white" aria-labelledby="seatpacks-faq">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="seatpacks-faq" className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]">
          Seat Pack FAQs
        </h2>

        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {faqs.map((f, i) => (
            <FAQItem key={i} {...f} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details open={open} onToggle={() => setOpen((v) => !v)} className="group">
      <summary className="cursor-pointer list-none px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">{q}</h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-emerald-950 text-xs">
            {open ? "–" : "+"}
          </span>
        </div>
      </summary>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-gray-700">{a}</div>
    </details>
  );
}

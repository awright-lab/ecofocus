"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "How long does a custom study take?",
    a: "Most complete in 2–8 weeks depending on scope, methods, and audience recruiting.",
  },
  {
    q: "What sample sizes do you recommend?",
    a: "We scope bases to the decision and segments. We’ll provide expected margins of error by base size.",
  },
  {
    q: "Can you join client data?",
    a: "Yes. We support hashed IDs and aggregated joins; many projects require no PII.",
  },
  {
    q: "Can results appear in the dashboard?",
    a: "Yes. We can enable a module for filtering, segmenting, and white-label exports.",
  },
  {
    q: "Do you support SSO and DPAs?",
    a: "SSO is available on Studio/Enterprise (add-on for eligible Team). We support security reviews and DPAs on Enterprise.",
  },
];

export default function FAQCustom() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-faq">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2
          id="custom-faq"
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]"
        >
          Custom Research FAQs
        </h2>

        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} initiallyOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  q,
  a,
  initiallyOpen = false,
}: {
  q: string;
  a: string;
  initiallyOpen?: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [open, setOpen] = useState<boolean>(initiallyOpen);

  // Set initial open once on mount; do not control afterwards
  useEffect(() => {
    if (detailsRef.current && initiallyOpen) {
      detailsRef.current.open = true;
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <details
      ref={detailsRef}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="group"
    >
      <summary className="cursor-pointer list-none px-5 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">{q}</h3>
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-emerald-950 ring-1 ring-amber-300/60">
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </div>
      </summary>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-gray-700">{a}</div>
    </details>
  );
}

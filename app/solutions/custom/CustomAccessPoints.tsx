'use client';

import Image from 'next/image';

const cards = [
  {
    title: 'Executive Storytelling',
    body: 'Top-line narrative, supporting charts, and implications tailored for senior leadership or board conversations.',
    img: '/images/custom-exec-summary.png',
  },
  {
    title: 'Team Working Sessions',
    body: 'Facilitated workshops to co-create territories, claims, and roadmaps using the custom findings.',
    img: '/images/custom-workshop.png',
  },
  {
    title: 'Data Files & Dashboard Hooks',
    body: 'Clean files and optional dashboard integration so your teams can keep exploring the data post-project.',
    img: '/images/custom-data-hooks.png',
  },
];

export default function CustomAccessPoints() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-access-points">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-18">
        <h2
          id="custom-access-points"
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Multiple Access Points to the Insights You Need
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.5)] p-6 flex flex-col"
            >
              <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600 flex-1">{c.body}</p>
              <div className="mt-4 relative h-40 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

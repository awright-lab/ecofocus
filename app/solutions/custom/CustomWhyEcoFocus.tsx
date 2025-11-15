'use client';

export default function CustomWhyEcoFocus() {
  const items = [
    {
      title: 'Framework + Flexibility',
      body:
        'We don’t start from a blank page. Custom designs plug into the EcoFocus framework so you can compare back to the broader market.',
    },
    {
      title: 'Decision-First Design',
      body:
        'Every question earns its place by linking to a decision: positioning, pack, audience, channel, or investment priority.',
    },
    {
      title: 'Senior Team on Every Project',
      body:
        'You work directly with senior researchers who know how to translate complex sustainability stories into clear narratives.',
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="custom-diff">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2
          id="custom-diff"
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What Makes EcoFocus Custom Work Different
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 text-sm sm:text-base">
          Custom projects stay rooted in the same sustainability lens as our syndicated work, so
          you can zoom in on your brand without losing the bigger picture.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {items.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.4)]"
            >
              <h3 className="font-semibold text-slate-900">{d.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

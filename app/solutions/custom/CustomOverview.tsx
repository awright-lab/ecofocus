'use client';

export default function CustomOverview() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="custom-overview" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Why Custom Studies with EcoFocus
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
          When you need answers we haven’t already captured in the syndicated study, we design a custom approach.
          Our team blends qualitative and quantitative methods, tailored samples, and tested sustainability constructs
          to reveal what people believe, prioritize, and do—so you can move from opinion to evidence.
        </p>
      </div>
    </section>
  );
}


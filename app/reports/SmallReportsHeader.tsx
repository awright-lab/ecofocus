'use client';

export default function SmallReportsHeader() {
  return (
    <section className="container mx-auto px-4 mt-8"> {/* margin from top */}
      <div className="mb-6 max-w-3xl">
        <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <h2 className="text-2xl mt-4 md:text-3xl font-bold">Small Reports</h2>
        <p className="mt-3 text-gray-700">
          Focused subsections from the Sustainability Insights Report. Choose a year—each includes a section PDF and key charts pack.
        </p>
      </div>
    </section>
  );
}


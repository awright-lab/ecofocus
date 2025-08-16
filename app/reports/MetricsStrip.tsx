'use client';

export default function MetricsStrip() {
  return (
    <section className="border-y border-gray-200 bg-gray-50">
      <div className="container mx-auto grid grid-cols-3 gap-4 px-4 py-6 text-center">
        <div>
          <div className="text-2xl font-bold">13+</div>
          <div className="text-sm text-gray-600">Years of Trend Data</div>
        </div>
        <div>
          <div className="text-2xl font-bold">90,000+</div>
          <div className="text-sm text-gray-600">Data Points Collected</div>
        </div>
        <div>
          <div className="text-2xl font-bold">± 1.55%</div>
          <div className="text-sm text-gray-600">Margin of Error</div>
        </div>
      </div>
    </section>
  );
}

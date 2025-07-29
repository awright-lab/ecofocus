'use client';

export default function FeaturedReportSection() {
    return (
        <section className="p-6">
            <div
                className="relative rounded-xl overflow-hidden text-white"
                style={{ backgroundImage: "url('/images/featured-report-bg.jpg')", backgroundSize: 'cover' }}
            >
                <div className="absolute top-2 left-2 bg-green-600 text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                </div>
                <div className="p-6 bg-black/50">
                    <h3 className="text-xl font-bold mb-2">
                        2025 Sustainability Insights Report
                    </h3>
                    <p className="text-sm mb-4">
                        Data-driven insights into environmental attitudes shaping purchasing behavior, brand loyalty, and business risk.
                    </p>
                    <p className="text-green-400 font-bold mb-4">$4,995</p>
                    <button className="bg-green-600 px-6 py-3 rounded-full font-semibold w-full">
                        Download Report
                    </button>
                    <button className="mt-2 text-green-300 underline w-full">
                        View More Reports
                    </button>
                </div>
            </div>
        </section>
    );
}


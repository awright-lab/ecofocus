'use client';

import Link from 'next/link';

export default function FeaturedReport() {
    return (
        <section className="py-20 bg-white relative">
            {/* Accent Shape */}
            <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-r from-blue-500 to-emerald-500 transform skew-y-3 opacity-20"></div>

            <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Featured Report</h2>
                <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
                    The most comprehensive sustainability insights report to power your decisions.
                </p>
                <div className="bg-gray-50 rounded-2xl shadow-lg p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-left">
                        <h3 className="text-2xl font-semibold mb-4">Sustainability Insights Report 2024</h3>
                        <p className="text-gray-700 mb-6">
                            Align your brand with evolving sustainability expectations through actionable data.
                        </p>
                        <Link
                            href="/reports"
                            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-transform hover:scale-105"
                        >
                            Learn More
                        </Link>
                    </div>
                    <img src="/report-cover.jpg" alt="Sustainability Report" className="rounded-xl shadow-lg" />
                </div>
            </div>
        </section>
    );
}




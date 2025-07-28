'use client';

import Link from 'next/link';

export default function FeaturedReport() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-6xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Featured Report</h2>
                <p className="text-gray-600 mb-10">
                    The most comprehensive sustainability insights report to power your decision-making.
                </p>
                <div className="bg-white rounded-xl shadow-md p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Sustainability Insights Report 2024</h3>
                        <p className="text-gray-600 mb-6">
                            Get actionable data to align your brand with evolving sustainability expectations.
                        </p>
                        <Link
                            href="/reports"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-transform hover:scale-105"
                        >
                            Learn More
                        </Link>
                    </div>
                    <img src="/report-cover.jpg" alt="Sustainability Report" className="rounded-lg shadow" />
                </div>
            </div>
        </section>
    );
}



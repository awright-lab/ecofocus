'use client';

import Link from 'next/link';

export default function FeaturedReport() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Featured Report</h2>
                <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
                    Our flagship Sustainability Insights Report offers the most comprehensive view into consumer sustainability behaviors and trends.
                </p>
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Sustainability Insights Report 2024
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Data-backed analysis of environmental attitudes, consumer trust, and long-term ROI opportunities.
                            </p>
                            <Link
                                href="/reports"
                                className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-lg"
                            >
                                Learn More
                            </Link>
                        </div>
                        <img
                            src="/report-cover.jpg"
                            alt="Sustainability Insights Report"
                            className="rounded-2xl shadow-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}


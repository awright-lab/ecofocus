'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EcoNuggetInsights() {
    const featured = {
        title: '2025 Sustainability Outlook',
        excerpt: 'Discover key environmental trends shaping consumer behavior and business strategies in 2025.',
        category: 'Trends',
        time: '4 min read',
        image: '/images/insight-feature.jpg',
        link: '/blog/2025-sustainability-outlook'
    };

    const posts = [
        {
            title: 'The Future of Packaging',
            category: 'Research',
            time: '3 min read',
            image: '/images/insight-1.jpg',
            link: '/blog/future-of-packaging'
        },
        {
            title: 'Consumer Trust in ESG',
            category: 'Strategy',
            time: '5 min read',
            image: '/images/insight-2.jpg',
            link: '/blog/consumer-trust-esg'
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white relative">
            <div className="max-w-6xl mx-auto px-6">
                {/* Category Tag + Header */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="uppercase text-xs tracking-wide bg-emerald-500/10 text-emerald-300 px-4 py-1 rounded-full border border-emerald-500/20">
                        EcoNuggets
                    </span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-left">
                    Fresh Insights with <span className="text-emerald-400">EcoNuggets</span>
                </h2>

                {/* Featured Card */}
                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                    {/* Text */}
                    <motion.div
                        className="flex flex-col justify-center bg-emerald-900/40 rounded-xl p-8 backdrop-blur-sm border border-emerald-700"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-sm uppercase text-emerald-400 mb-2">Featured</span>
                        <h3 className="text-3xl font-bold mb-4">{featured.title}</h3>
                        <p className="text-gray-300 mb-6">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="bg-emerald-800 px-3 py-1 rounded-full">{featured.category}</span>
                            <span>{featured.time}</span>
                        </div>
                        <Link
                            href={featured.link}
                            className="mt-6 inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition"
                        >
                            Read More →
                        </Link>
                    </motion.div>

                    {/* Image with Hover Effect */}
                    <motion.div
                        className="relative overflow-hidden rounded-xl group"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Image
                            src={featured.image}
                            alt={featured.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Animated Overlay */}
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g className="transition-all duration-700 group-hover:translate-x-full group-hover:rotate-12">
                                <rect x="0" y="0" width="100%" height="100%" fill="rgba(5,150,105,0.25)" />
                                <rect
                                    x="-20"
                                    y="20"
                                    width="150%"
                                    height="40"
                                    fill="rgba(6,182,212,0.3)"
                                    transform="rotate(-15)"
                                />
                                <rect
                                    x="-50"
                                    y="80"
                                    width="150%"
                                    height="40"
                                    fill="rgba(16,185,129,0.25)"
                                    transform="rotate(-15)"
                                />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="120"
                                    fill="rgba(255,255,255,0.08)"
                                    className="transition-all duration-700 group-hover:scale-0 group-hover:opacity-0"
                                />
                            </g>
                        </svg>
                    </motion.div>
                </div>

                {/* Two smaller cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {posts.map((post, i) => (
                        <motion.div
                            key={i}
                            className="relative rounded-xl overflow-hidden group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                        >
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={500}
                                height={350}
                                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/30 to-transparent flex flex-col justify-end p-6">
                                <span className="text-sm text-emerald-300 uppercase mb-2">{post.category}</span>
                                <h4 className="text-xl font-bold mb-2">{post.title}</h4>
                                <div className="text-gray-300 text-sm">{post.time}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/blog"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold transition"
                    >
                        See All Insights
                    </Link>
                </div>
            </div>
        </section>
    );
}




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
        image: '/images/blogs/789b87_124054fd6ae6426a8a3704ac7202498d~mv2.png',
        link: '/blog/2025-sustainability-outlook'
    };

    const posts = [
        {
            title: 'The Future of Packaging',
            category: 'Research',
            time: '3 min read',
            image: '/images/blogs/789b87_bb45408bfd124de4b8ee212b555dcb10~mv2.png',
            link: '/blog/future-of-packaging'
        },
        {
            title: 'Consumer Trust in ESG',
            category: 'Strategy',
            time: '5 min read',
            image: '/images/blogs/789b87_ccb5f325dfb94da3877531229248edc3~mv2.png',
            link: '/blog/consumer-trust-esg'
        }
    ];

    return (
        <section className="relative py-24 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white overflow-hidden">
            {/* Floating Gradient Orbs */}
            <div className="absolute top-10 left-[-150px] w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-150px] right-[-100px] w-[250px] h-[250px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="uppercase text-[10px] tracking-wide bg-emerald-500/10 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/20">
                        EcoNuggets
                    </span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    Fresh Insights with <span className="bg-clip-text text-transparent animate-gradient 
                         bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500">EcoNuggets</span>
                </h2>

                {/* Featured Card */}
                <Link href={featured.link} className="block group mb-16">
                    <motion.div
                        className="relative rounded-xl overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative w-full h-[480px] overflow-hidden rounded-xl">
                            <Image
                                src={featured.image}
                                alt={featured.title}
                                width={1200}
                                height={600}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/40 to-transparent p-10 flex flex-col justify-end">
                                <span className="text-sm uppercase text-emerald-400 mb-3">Featured</span>
                                <h3 className="text-4xl font-bold mb-4">{featured.title}</h3>
                                <p className="text-gray-300 mb-6 max-w-2xl">{featured.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                                    <span className="bg-emerald-800 px-3 py-1 rounded-full">{featured.category}</span>
                                    <span>{featured.time}</span>
                                </div>
                                {/* Button */}
                                <div className="flex justify-start">
                                    <Link
                                        href={featured.link}
                                        className="relative inline-block px-5 py-2 text-sm font-semibold text-black rounded-full bg-[#FFC107] overflow-hidden transition-all duration-300
                                        before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                                        before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                                    >
                                        <span className="relative z-10">Read More →</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Hover shimmer bar */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </div>
                    </motion.div>
                </Link>

                {/* Secondary Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {posts.map((post, i) => (
                        <Link key={i} href={post.link} className="block group">
                            <motion.div
                                className="relative rounded-xl overflow-hidden shadow-xl hover:shadow-emerald-700/30"
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
                                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/30 to-transparent flex flex-col justify-end p-6">
                                    <span className="text-sm text-emerald-300 uppercase mb-2">{post.category}</span>
                                    <h4 className="text-2xl font-bold mb-2 transition-colors duration-300 group-hover:text-emerald-400">
                                        {post.title}
                                    </h4>
                                    <div className="text-gray-300 text-sm">{post.time}</div>
                                </div>
                                {/* Hover shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-14">
                    <Link
                        href="/blog"
                        className="relative inline-block px-5 py-2 text-sm font-semibold text-black rounded-full bg-[#FFC107] overflow-hidden transition-all duration-300
                                        before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                                        before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                    >
                        <span className="relative z-10">See All Insights</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}









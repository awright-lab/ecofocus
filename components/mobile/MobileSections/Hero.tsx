'use client';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import ecoAnimation from '@/public/lottie/eco.json';

export default function HeroSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center shadow-lg relative overflow-hidden"
        >
            <div className="w-32 mx-auto mb-4">
                <Lottie animationData={ecoAnimation} loop={true} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sustainability Insights</h2>
            <p className="text-sm mb-4">Bite-sized trends to keep you ahead of the curve.</p>
            <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold"
            >
                Explore Insights
            </motion.button>
        </motion.div>
    );
}





  
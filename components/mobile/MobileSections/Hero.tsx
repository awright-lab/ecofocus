'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <motion.section
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.h1
                className="text-2xl font-bold"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                Sustainability Insights That Drive Growth
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-300">
                Data-backed research to guide sustainability decisions since 2010.
            </p>
            <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-4 py-2 rounded-full mt-4"
            >
                Learn More
            </motion.button>
        </motion.section>
    );
}


  
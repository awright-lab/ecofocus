'use client';

import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
        >
            <h2 className="text-xl font-bold mb-3">About EcoFocus</h2>
            <p className="text-gray-700 dark:text-gray-300">
                Your best resource for sustainability research and actionable insights. Researching consumer sustainability behaviors and attitudes for more than a decade.
            </p>
        </motion.div>
    );
}


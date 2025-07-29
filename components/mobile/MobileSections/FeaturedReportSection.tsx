'use client';

import { motion } from 'framer-motion';

export default function FeaturedReportSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
        >
            <h2 className="text-xl font-bold mb-2">2025 Sustainability Insights Report</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Data-driven insights into environmental attitudes shaping purchasing behavior, brand loyalty, and business risk.
            </p>
            <p className="text-green-600 font-bold mb-4">$4,995</p>
            <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold"
            >
                Download Report
            </motion.button>
            <div className="mt-4">
                <button className="text-green-600 font-semibold underline">View More Reports</button>
            </div>
        </motion.div>
    );
}

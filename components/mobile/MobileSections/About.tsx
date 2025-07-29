'use client';

import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.section
            className="space-y-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.h2 className="text-xl font-bold">About EcoFocus</motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300"
            >
                We provide sustainability research and actionable insights to help brands make informed
                decisions. Our mission is to guide businesses in creating strategies that align with
                environmental responsibility.
            </motion.p>
        </motion.section>
    );
}

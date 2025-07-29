'use client';

import { motion } from 'framer-motion';

interface EcoNuggetCardProps {
    title: string;
    tag: string;
    cta: string;
}

export default function EcoNuggetCard({ title, tag, cta }: EcoNuggetCardProps) {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col space-y-4 w-full"
        >
            <span className="text-xs text-green-600 font-semibold">{tag}</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <motion.button
                whileTap={{ scale: 0.9 }}
                className="self-start bg-green-600 text-white text-sm px-4 py-2 rounded-full"
                onClick={() => alert('Open full report')}
            >
                {cta}
            </motion.button>
        </motion.div>
    );
}



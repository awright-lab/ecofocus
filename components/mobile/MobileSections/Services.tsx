'use client';

import { motion } from 'framer-motion';

const services = [
    {
        title: 'Syndicated Study',
        description: 'Comprehensive annual research on sustainability attitudes and behaviors across the U.S. market.'
    },
    {
        title: 'Custom Research',
        description: 'Tailored studies to answer your unique sustainability and business questions.'
    },
    {
        title: 'Interactive Dashboard',
        description: 'On-demand access to data, insights, and advanced analytics tools.'
    }
];

export default function Services() {
    return (
        <div className="grid gap-4">
            {services.map((service, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
                >
                    <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
                </motion.div>
            ))}
        </div>
    );
}


  
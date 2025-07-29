'use client';

import { motion } from 'framer-motion';

const services = [
    'Custom Research',
    'Interactive Dashboards',
    'Sustainability Reports'
];

export default function Services() {
    return (
        <motion.section
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.h2 className="text-xl font-bold">Our Services</motion.h2>
            <ul className="space-y-2">
                {services.map((service, index) => (
                    <motion.li
                        key={service}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index }}
                        className="flex items-center space-x-2"
                    >
                        <span className="text-green-600">✔</span>
                        <span>{service}</span>
                    </motion.li>
                ))}
            </ul>
        </motion.section>
    );
}

  
'use client';

import { FaChartLine, FaShieldAlt, FaLeaf, FaUsers } from 'react-icons/fa';

const reasons = [
    { icon: <FaChartLine />, title: 'Reliable Data', desc: 'Industry-leading research methodology.' },
    { icon: <FaLeaf />, title: 'Sustainability Focus', desc: 'Dedicated to environmental trends.' },
    { icon: <FaUsers />, title: 'Trusted by Brands', desc: 'Partnerships with top companies.' },
    { icon: <FaShieldAlt />, title: '14+ Years Expertise', desc: 'Decade-plus of actionable insights.' }
];

export default function WhyChooseSection() {
    return (
        <section className="p-6">
            <h2 className="text-xl font-bold mb-4">Why Choose EcoFocus?</h2>
            <div className="grid grid-cols-2 gap-4">
                {reasons.map((reason, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 flex flex-col items-start shadow">
                        <div className="text-green-600 text-2xl mb-2">{reason.icon}</div>
                        <h3 className="font-semibold">{reason.title}</h3>
                        <p className="text-xs text-gray-600">{reason.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

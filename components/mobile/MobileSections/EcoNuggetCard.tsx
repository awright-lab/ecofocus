'use client';

const nuggets = [
    {
        id: 1,
        text: '74% of Gen Z consumers prioritize sustainability when choosing brands.'
    },
    {
        id: 2,
        text: 'Eco-friendly packaging boosts purchase intent by 35% across all demographics.'
    },
    {
        id: 3,
        text: '91% of Millennials expect companies to have a sustainability mission.'
    },
    {
        id: 4,
        text: 'Consumers trust brands 2x more when sustainability goals are transparent.'
    }
];

export default function EcoNuggetsSection() {
    return (
        <section className="p-6">
            <h2 className="text-xl font-bold mb-4">Eco Nuggets</h2>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar">
                {nuggets.map((n) => (
                    <div
                        key={n.id}
                        className="min-w-[240px] bg-green-50 rounded-lg p-4 shadow-md flex flex-col justify-between"
                    >
                        <p className="text-sm text-gray-800 mb-4">{n.text}</p>
                        <button className="text-green-600 font-semibold underline text-sm">
                            Learn More
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}




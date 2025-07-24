
'use client';

export default function StatsSection() {
  const stats = [
    {
      icon: 'ri-database-2-line',
      number: '90,000+',
      label: 'Data Points Analyzed',
      description: 'Comprehensive sustainability metrics tracked'
    },
    {
      icon: 'ri-building-line',
      number: '500+',
      label: 'Companies Served',
      description: 'From startups to Fortune 500 enterprises'
    },
    {
      icon: 'ri-file-text-line',
      number: '200+',
      label: 'Research Reports',
      description: 'Published across various industries'
    },
    {
      icon: 'ri-global-line',
      number: '45+',
      label: 'Countries Covered',
      description: 'Global sustainability research network'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 mb-4">
              <i className="ri-bar-chart-line text-white"></i>
              Impact by Numbers
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Global Research Impact
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our research has helped organizations across the globe make more sustainable decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-4">
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-white/90 mb-2">{stat.label}</div>
                <p className="text-sm text-white/80">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'ri-line-chart-line',
      title: 'Real-time Analytics',
      description: 'Monitor sustainability metrics with live data updates and instant insights',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'ri-pie-chart-line',
      title: 'Interactive Visualizations',
      description: 'Explore data through dynamic charts, graphs, and interactive elements',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: 'ri-settings-3-line',
      title: 'Customizable Dashboards',
      description: 'Create personalized views tailored to your specific needs and goals',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: 'ri-database-2-line',
      title: 'Comprehensive Data Access',
      description: 'Access every question and data point from our extensive research database',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: 'ri-filter-3-line',
      title: 'Advanced Filtering',
      description: 'Drill down into specific demographics, regions, and time periods',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'ri-share-line',
      title: 'Export & Sharing',
      description: 'Export reports and share insights with your team in multiple formats',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
              <i className="ri-star-fill text-emerald-500"></i>
              Dashboard Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Data-Driven Decisions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our interactive dashboard provides comprehensive tools to analyze, visualize, and act on sustainability data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl hover:shadow-lg transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
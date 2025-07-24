
'use client';

export default function TechnologySection() {
  const technologies = [
    {
      name: 'Advanced Analytics',
      description: 'Sophisticated data analysis techniques to uncover hidden patterns and trends in sustainability data.',
      features: ['Statistical modeling', 'Predictive analytics', 'Trend analysis', 'Pattern recognition']
    },
    {
      name: 'Consumer Insights Platform',
      description: 'Comprehensive platform for analyzing consumer behavior and preferences in sustainability.',
      features: ['Behavioral tracking', 'Preference analysis', 'Segmentation tools', 'Insight generation']
    },
    {
      name: 'Custom Research Tools',
      description: 'Proprietary research methodologies and tools designed specifically for sustainability research.',
      features: ['Survey design', 'Data collection', 'Analysis frameworks', 'Reporting systems']
    },
    {
      name: 'Integrated Reporting',
      description: 'Comprehensive reporting solutions that combine multiple data sources for holistic insights.',
      features: ['Multi-source integration', 'Visual dashboards', 'Interactive reports', 'Real-time updates']
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-6">
              <i className="ri-settings-3-line text-blue-500"></i>
              Our Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Research Technology
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our solutions leverage cutting-edge technology and proven methodologies to provide accurate, actionable sustainability insights that drive meaningful business impact.
            </p>
            
            <div className="space-y-6">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tech.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{tech.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 px-3 py-1 rounded-full text-sm border border-emerald-200">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl transform rotate-2"></div>
            <div 
              className="relative h-96 bg-cover bg-center rounded-2xl shadow-xl"
              style={{
                backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20sustainability%20research%20technology%20dashboard%20with%20advanced%20analytics%20interface%2C%20environmental%20data%20visualization%2C%20interactive%20charts%20and%20graphs%20showing%20sustainability%20metrics%2C%20clean%20professional%20workspace%20with%20multiple%20monitors%20displaying%20ESG%20data%20analysis%2C%20contemporary%20office%20with%20natural%20lighting%20and%20green%20technology%20elements&width=600&height=400&seq=research-technology&orientation=landscape')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Real-Time Insights</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Access comprehensive sustainability data and insights through our intuitive dashboard, with real-time updates and interactive analysis tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

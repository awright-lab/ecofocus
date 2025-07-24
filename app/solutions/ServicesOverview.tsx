
'use client';

export default function ServicesOverview() {
  const services = [
    {
      icon: 'ri-lightbulb-line',
      title: 'Strategic Insights',
      description: 'Armed with more than a decade of consumer data, EcoFocus is uniquely positioned to provide valuable research-based insights and trends on the evolving world of consumer attitudes and behaviors toward sustainability.',
      features: ['Consumer behavior analysis', 'Sustainability trend forecasting', 'Market opportunity identification', 'Data-driven recommendations']
    },
    {
      icon: 'ri-line-chart-line',
      title: 'Trend Analysis',
      description: 'Only EcoFocus has multiple years of data available at our fingertips to spot upward and downward attitude and behavioral shifts. We can see what changes are occurring and what areas need more work.',
      features: ['Historical data analysis', 'Trend identification', 'Behavioral pattern recognition', 'Future prediction modeling']
    },
    {
      icon: 'ri-search-line',
      title: 'Custom Research - B2C & B2B',
      description: 'We offer customized research solutions designed to address your unique business challenges. Our experienced team can dive right in and design custom research to answer your specific questions.',
      features: ['Tailored research design', 'B2C and B2B studies', 'Custom methodologies', 'Actionable insights delivery']
    },
    {
      icon: 'ri-user-settings-line',
      title: 'Expert Consulting',
      description: 'The EcoFocus team of experts are available to help you with your research project, large or small. From one-day strategy sessions to multi-week projects, we provide comprehensive support.',
      features: ['Strategy development', 'Implementation guidance', 'Expert consultation', 'Project management']
    },
    {
      icon: 'ri-database-2-line',
      title: 'Data Integration',
      description: 'Combine EcoFocus data with your existing insights for a comprehensive view of consumer sustainability behaviors and market opportunities.',
      features: ['Data synthesis', 'Custom analytics', 'Integrated reporting', 'Cross-platform insights']
    },
    {
      icon: 'ri-presentation-line',
      title: 'Market Intelligence',
      description: 'Stay ahead of the competition with our comprehensive market intelligence reports and competitive analysis in the sustainability space.',
      features: ['Competitive analysis', 'Market positioning', 'Industry benchmarking', 'Strategic planning']
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
            <i className="ri-service-line text-blue-500"></i>
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Sustainability Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From strategic insights to custom research, we offer end-to-end solutions designed to meet your organization's unique sustainability challenges and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <i className={`${service.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 flex items-center justify-center bg-emerald-100 rounded-full flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-emerald-600 text-xs"></i>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


'use client';

export default function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Discovery & Assessment',
      description: 'We begin with a comprehensive discovery call to understand your sustainability goals, challenges, and research needs.',
      details: ['Needs assessment', 'Goal identification', 'Resource evaluation', 'Timeline planning']
    },
    {
      number: '02',
      title: 'Strategy Development',
      description: 'Our experts design a tailored research strategy that aligns with your business objectives and sustainability priorities.',
      details: ['Research design', 'Methodology selection', 'Sample determination', 'Question development']
    },
    {
      number: '03',
      title: 'Data Collection & Analysis',
      description: 'We leverage our extensive database and conduct additional research to gather comprehensive insights.',
      details: ['Data gathering', 'Statistical analysis', 'Trend identification', 'Pattern recognition']
    },
    {
      number: '04',
      title: 'Insight Generation',
      description: 'Our team transforms raw data into actionable insights and strategic recommendations tailored to your needs.',
      details: ['Data interpretation', 'Insight development', 'Recommendation formulation', 'Strategic planning']
    },
    {
      number: '05',
      title: 'Reporting & Presentation',
      description: 'We deliver comprehensive reports and presentations that clearly communicate findings and recommendations.',
      details: ['Report creation', 'Visualization design', 'Presentation delivery', 'Executive summary']
    },
    {
      number: '06',
      title: 'Implementation Support',
      description: 'Ongoing support and consultation to help you implement insights and achieve your sustainability objectives.',
      details: ['Implementation guidance', 'Progress monitoring', 'Optimization support', 'Continuous improvement']
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-4">
            <i className="ri-route-line text-emerald-500"></i>
            Our Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How We Work With You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From initial consultation to implementation support, our proven process ensures successful outcomes for your sustainability initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center mb-6">
                <div className="text-4xl font-bold text-emerald-600 mr-4 group-hover:scale-110 transition-transform">{step.number}</div>
                <div className="h-px bg-gradient-to-r from-emerald-200 to-blue-200 flex-1"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
              <ul className="space-y-3">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                      <i className="ri-arrow-right-line text-blue-600 text-xs"></i>
                    </div>
                    <span>{detail}</span>
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

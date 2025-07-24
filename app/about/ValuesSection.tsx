
'use client';

export default function ValuesSection() {
  const values = [
    {
      icon: 'ri-shield-check-line',
      title: 'Scientific Rigor',
      description: 'Every research project follows strict scientific methodology and peer review processes to ensure accuracy and reliability.'
    },
    {
      icon: 'ri-lightbulb-line',
      title: 'Innovation',
      description: 'We continuously explore new technologies and methodologies to enhance our research capabilities and deliver cutting-edge insights.'
    },
    {
      icon: 'ri-team-line',
      title: 'Collaboration',
      description: 'We work closely with clients, partners, and the broader sustainability community to maximize impact and drive collective progress.'
    },
    {
      icon: 'ri-earth-line',
      title: 'Environmental Impact',
      description: 'Our ultimate goal is to contribute to a more sustainable future through research that drives meaningful environmental action.'
    },
    {
      icon: 'ri-eye-line',
      title: 'Transparency',
      description: 'We maintain open communication about our methodologies, findings, and limitations to build trust and credibility.'
    },
    {
      icon: 'ri-rocket-line',
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, from data collection to client service and report delivery.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
              <i className="ri-heart-line text-blue-500"></i>
              Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we approach sustainability research
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl hover:shadow-lg transition-all border border-gray-100">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mb-4">
                  <i className={`${value.icon} text-xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

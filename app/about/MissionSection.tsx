
'use client';

export default function MissionSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Research Excellence Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
              <i className="ri-award-line text-blue-500"></i>
              Research Excellence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming Data Into Action
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our innovative research methodologies and cutting-edge analytics provide the foundation for meaningful sustainability transformation
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <i className="ri-database-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Comprehensive Data Collection</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We gather sustainability data from multiple sources, ensuring a complete picture of environmental trends and consumer behavior patterns across industries.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <i className="ri-brain-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Our team uses machine learning and statistical modeling to uncover hidden patterns and predict future sustainability trends with unprecedented accuracy.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <i className="ri-target-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Actionable Insights</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We transform complex data into clear, actionable recommendations that drive measurable environmental impact and business success.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl transform rotate-2"></div>
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20sustainability%20research%20laboratory%20with%20scientists%20analyzing%20environmental%20data%20on%20multiple%20screens%2C%20advanced%20analytics%20workstation%20with%20charts%20and%20graphs%2C%20team%20members%20in%20professional%20attire%20working%20with%20sustainable%20technology%2C%20bright%20contemporary%20office%20space%20with%20plants%20and%20eco-friendly%20design%20elements%2C%20data%20visualization%20displays%20showing%20environmental%20metrics%20and%20trends&width=600&height=500&seq=research-excellence&orientation=portrait"
                alt="Research Excellence in Action"
                className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
              />
            </div>
          </div>

          {/* Impact Areas */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-leaf-line text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Environmental Impact</h4>
              <p className="text-gray-600">Measuring and optimizing environmental outcomes across all business operations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-group-line text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Social Responsibility</h4>
              <p className="text-gray-600">Understanding consumer values and social impact across diverse communities</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-line-chart-line text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Economic Growth</h4>
              <p className="text-gray-600">Driving sustainable business growth through data-driven decision making</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl p-8">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Impact?</h3>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8">
              Join hundreds of organizations who trust EcoFocus Research to guide their sustainability journey with reliable data and expert insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

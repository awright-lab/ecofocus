'use client';

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold mb-4">
              <i className="ri-trophy-line"></i>
              Benefits
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Dashboard?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your sustainability reporting from static documents to dynamic, actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <i className="ri-time-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Save Time & Resources</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Reduce report generation time by 80% with automated data visualization and instant insights. No more manual data compilation or static reports.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <i className="ri-lightbulb-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Uncover Hidden Insights</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Discover patterns and trends that aren't visible in traditional reports. Our interactive tools help you ask the right questions and find meaningful answers.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <i className="ri-team-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Improve Team Collaboration</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Share live dashboards with stakeholders, enable real-time collaboration, and ensure everyone works with the same up-to-date information.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-2xl transform rotate-2"></div>
              <img
                src="https://readdy.ai/api/search-image?query=Business%20team%20collaborating%20around%20a%20large%20monitor%20displaying%20sustainability%20dashboard%20with%20environmental%20data%20charts%2C%20graphs%2C%20and%20ESG%20metrics%2C%20modern%20office%20environment%20with%20diverse%20professionals%20analyzing%20real-time%20data%2C%20pointing%20at%20interactive%20visualizations%2C%20contemporary%20workspace%20with%20natural%20lighting%20and%20plants%2C%20collaborative%20meeting%20atmosphere&width=600&height=500&seq=team-collaboration&orientation=portrait"
                alt="Team using sustainability dashboard"
                className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
              />
            </div>
          </div>

          {/* ROI Statistics */}
          <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Proven ROI for Our Clients
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Organizations using our dashboard report significant improvements in efficiency and decision-making
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-timer-line text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">80%</div>
                <div className="text-sm text-gray-600">Time Savings</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-eye-line text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-sm text-gray-600">Data Visibility</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-arrow-up-line text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">65%</div>
                <div className="text-sm text-gray-600">Faster Decisions</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
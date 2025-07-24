
'use client';

export default function TeamSection() {
  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Executive Officer',
      expertise: 'Environmental Science, Data Analytics',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20female%20CEO%20in%20her%2040s%2C%20confident%20smile%2C%20wearing%20modern%20business%20attire%2C%20clean%20white%20background%2C%20professional%20lighting%2C%20sustainability%20leadership%2C%20corporate%20executive%20portrait&width=300&height=300&seq=team-sarah&orientation=squarish'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Research',
      expertise: 'Climate Science, Statistical Analysis',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Hispanic%20male%20research%20director%20in%20his%2040s%2C%20friendly%20professional%20demeanor%2C%20wearing%20business%20casual%2C%20clean%20white%20background%2C%20academic%20research%20leader%2C%20environmental%20scientist%20portrait&width=300&height=300&seq=team-michael&orientation=squarish'
    },
    {
      name: 'Dr. Emily Thompson',
      role: 'Director of Analytics',
      expertise: 'Machine Learning, Sustainability Metrics',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Caucasian%20female%20data%20scientist%20in%20her%2030s%2C%20intelligent%20expression%2C%20wearing%20professional%20attire%2C%20clean%20white%20background%2C%20analytics%20expert%2C%20technology%20leader%20portrait&width=300&height=300&seq=team-emily&orientation=squarish'
    },
    {
      name: 'David Kim',
      role: 'VP of Client Solutions',
      expertise: 'Business Strategy, ESG Consulting',
      image: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Korean%20male%20business%20executive%20in%20his%2040s%2C%20approachable%20smile%2C%20wearing%20suit%2C%20clean%20white%20background%2C%20client%20relations%20expert%2C%20sustainability%20consultant%20portrait&width=300&height=300&seq=team-david&orientation=squarish'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-4">
              <i className="ri-team-line text-emerald-500"></i>
              Our Leadership
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by industry experts with decades of combined experience in sustainability research and data science
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for talented researchers, data scientists, and sustainability experts to join our mission of driving environmental impact through data-driven insights.
              </p>
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                View Open Positions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

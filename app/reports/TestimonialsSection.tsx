
'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "Head of Sustainability",
      company: "Global Manufacturing Corp",
      avatar: "https://readdy.ai/api/search-image?query=Professional%20Asian%20businesswoman%20in%20corporate%20attire%20smiling%20confidently%20in%20modern%20office%20environment%20with%20sustainability%20focus%20and%20corporate%20background&width=100&height=100&seq=testimonial-1&orientation=squarish",
      content: "EcoFocus reports have been instrumental in shaping our sustainability strategy. The depth of analysis and actionable insights have helped us reduce our carbon footprint by 35% while improving operational efficiency.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      title: "Investment Director",
      company: "Green Capital Partners",
      avatar: "https://readdy.ai/api/search-image?query=Professional%20Hispanic%20businessman%20in%20business%20suit%20with%20confident%20expression%20in%20modern%20financial%20office%20setting%20with%20investment%20and%20sustainability%20themes&width=100&height=100&seq=testimonial-2&orientation=squarish",
      content: "The ESG investment reports provide unparalleled market intelligence. We've identified several high-performing sustainable investments that have outperformed our portfolio by 28% this year.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      title: "Chief Research Officer",
      company: "Renewable Energy Institute",
      avatar: "https://readdy.ai/api/search-image?query=Professional%20female%20scientist%20with%20PhD%20in%20clean%20energy%20research%20wearing%20professional%20attire%20in%20modern%20research%20facility%20with%20renewable%20energy%20technology%20background&width=100&height=100&seq=testimonial-3&orientation=squarish",
      content: "As a research institution, we rely on high-quality data and analysis. EcoFocus consistently delivers comprehensive reports that inform our policy recommendations and research direction.",
      rating: 5
    },
    {
      name: "James Thompson",
      title: "Sustainability Consultant",
      company: "GreenTech Solutions",
      avatar: "https://readdy.ai/api/search-image?query=Professional%20Caucasian%20male%20sustainability%20consultant%20in%20business%20casual%20attire%20with%20environmental%20consulting%20background%20and%20green%20technology%20themes&width=100&height=100&seq=testimonial-4&orientation=squarish",
      content: "The industry-specific reports have been game-changers for our consulting practice. Our clients appreciate the detailed analysis and practical recommendations that drive real business results.",
      rating: 5
    },
    {
      name: "Lisa Park",
      title: "ESG Manager",
      company: "Tech Innovation Inc",
      avatar: "https://readdy.ai/api/search-image?query=Professional%20Asian%20female%20ESG%20manager%20in%20modern%20tech%20office%20environment%20with%20sustainability%20and%20environmental%20responsibility%20focus%20in%20corporate%20setting&width=100&height=100&seq=testimonial-5&orientation=squarish",
      content: "EcoFocus reports helped us achieve our first ESG certification and improve our sustainability rating by two levels. The compliance guidance was particularly valuable for our regulatory requirements.",
      rating: 5
    },
    {
      name: "David Kumar",
      title: "Operations Director",
      company: "Sustainable Logistics Ltd",
      avatar: "https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20operations%20director%20in%20corporate%20attire%20with%20logistics%20and%20supply%20chain%20management%20background%20in%20modern%20business%20office%20setting&width=100&height=100&seq=testimonial-6&orientation=squarish",
      content: "The supply chain sustainability reports provided the roadmap we needed to transform our operations. We've reduced waste by 40% and improved vendor sustainability scores across the board.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
              <i className="ri-heart-line text-blue-500"></i>
              Client Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Trusted by 500+ organizations worldwide to drive their sustainability transformations</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 hover:shadow-lg transition-all transform hover:scale-105 border border-gray-100">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                    <p className="text-sm text-emerald-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-lg"></i>
                  ))}
                </div>
                
                <p className="text-gray-700 text-sm italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Join hundreds of organizations worldwide driving sustainable change with our insights</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-600 mb-2">1M+</div>
                  <div className="text-gray-600">Reports Downloaded</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
                  <div className="text-gray-600">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', { email, interests });
    setEmail('');
    setInterests([]);
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const interestOptions = [
    'ESG Reporting',
    'Carbon Management',
    'Renewable Energy',
    'Supply Chain',
    'Circular Economy',
    'Green Building'
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <i className="ri-mail-line text-white"></i>
            Weekly Newsletter
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Never Miss a Sustainability Insight
          </h2>
          <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Get weekly research updates, expert analysis, and industry trends delivered to your inbox
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                  required
                />
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-emerald-100 mb-4">Select your interests (optional):</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        interests.includes(interest)
                          ? 'bg-white text-emerald-600 shadow-lg'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
              >
                Subscribe to Newsletter
              </button>
            </div>
          </form>
          
          <p className="text-sm text-emerald-100 mt-6">
            Join 12,000+ sustainability professionals who trust our insights
          </p>
        </div>
      </div>
    </section>
  );
}

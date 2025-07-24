
'use client';

export default function IndustriesSection() {
  const industries = [
    {
      name: 'Consumer Packaged Goods',
      icon: 'ri-shopping-bag-line',
      description: 'Packaging innovation, consumer behavior analysis, and sustainability messaging for CPG brands.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20consumer%20packaged%20goods%20display%20with%20eco-friendly%20packaging%2C%20recyclable%20materials%2C%20natural%20products%20on%20clean%20retail%20shelves%2C%20green%20packaging%20designs%2C%20environmentally%20conscious%20branding%2C%20organic%20food%20products%20in%20sustainable%20containers%2C%20clean%20bright%20retail%20environment%20with%20natural%20lighting&width=400&height=300&seq=cpg-industry&orientation=landscape'
    },
    {
      name: 'Food & Beverage',
      icon: 'ri-restaurant-line',
      description: 'Consumer preferences for sustainable food choices, organic trends, and packaging solutions.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20food%20and%20beverage%20production%20facility%20with%20organic%20ingredients%2C%20eco-friendly%20packaging%20systems%2C%20workers%20in%20clean%20food%20processing%20environment%2C%20sustainable%20agriculture%20elements%2C%20natural%20food%20products%20with%20green%20packaging%2C%20environmental%20consciousness%20in%20food%20production&width=400&height=300&seq=food-beverage&orientation=landscape'
    },
    {
      name: 'Building Materials',
      icon: 'ri-building-line',
      description: 'Green building trends, sustainable material preferences, and construction industry insights.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20building%20materials%20warehouse%20with%20eco-friendly%20construction%20materials%2C%20renewable%20resources%2C%20green%20building%20supplies%2C%20sustainable%20wood%20products%2C%20recycled%20materials%20display%2C%20environmentally%20conscious%20construction%20materials%20in%20professional%20warehouse%20setting&width=400&height=300&seq=building-materials&orientation=landscape'
    },
    {
      name: 'Health & Personal Care',
      icon: 'ri-heart-pulse-line',
      description: 'Natural product preferences, clean beauty trends, and sustainable health solutions.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20health%20and%20personal%20care%20products%20display%20with%20natural%20ingredients%2C%20eco-friendly%20packaging%2C%20organic%20beauty%20products%2C%20clean%20cosmetics%20in%20sustainable%20containers%2C%20green%20wellness%20products%20on%20clean%20white%20shelves%20with%20natural%20lighting&width=400&height=300&seq=health-care&orientation=landscape'
    },
    {
      name: 'Household Products',
      icon: 'ri-home-line',
      description: 'Eco-friendly cleaning solutions, sustainable household goods, and green home trends.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20household%20products%20display%20with%20eco-friendly%20cleaning%20supplies%2C%20biodegradable%20products%2C%20refillable%20containers%2C%20green%20household%20items%20arranged%20on%20clean%20shelves%2C%20natural%20cleaning%20products%20in%20sustainable%20packaging&width=400&height=300&seq=household-products&orientation=landscape'
    },
    {
      name: 'Financial Services',
      icon: 'ri-bank-line',
      description: 'ESG investment trends, sustainable finance solutions, and green banking initiatives.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20finance%20office%20with%20professionals%20analyzing%20ESG%20investment%20data%2C%20green%20finance%20documents%2C%20sustainable%20investment%20portfolios%2C%20clean%20corporate%20environment%20with%20environmental%20reports%20and%20sustainability%20metrics%20on%20screens&width=400&height=300&seq=financial-services&orientation=landscape'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
            <i className="ri-building-2-line text-emerald-500"></i>
            Industry Expertise
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Specialized Solutions by Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We serve diverse industries with specialized sustainability research and consulting solutions tailored to unique sector challenges and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
              <div className="h-48 bg-cover bg-center relative" style={{backgroundImage: `url('${industry.image}')`}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <i className={`${industry.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.name}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{industry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

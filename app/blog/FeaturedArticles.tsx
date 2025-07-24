
'use client';

import Link from 'next/link';

export default function FeaturedArticles() {
  const featuredArticles = [
    {
      id: 1,
      title: "The Future of ESG Reporting: 2024 Regulatory Updates",
      excerpt: "Comprehensive analysis of new ESG reporting requirements and how companies can prepare for compliance in the evolving regulatory landscape.",
      category: "ESG Reporting",
      author: "Dr. Sarah Mitchell",
      date: "December 15, 2024",
      readTime: "8 min read",
      image: "https://readdy.ai/api/search-image?query=Professional%20business%20meeting%20with%20executives%20discussing%20ESG%20regulatory%20compliance%20documents%20and%20sustainability%20reporting%20frameworks%20in%20a%20modern%20conference%20room%20with%20environmental%20charts%20and%20regulatory%20guidelines%20displayed%20on%20screens&width=600&height=400&seq=featured-1&orientation=landscape",
      featured: true
    },
    {
      id: 2,
      title: "Carbon Neutral vs Net Zero: Understanding the Difference",
      excerpt: "Clear explanations of carbon neutrality and net-zero commitments, including implementation strategies and measurement frameworks for businesses.",
      category: "Carbon Management",
      author: "Michael Chen",
      date: "December 12, 2024",
      readTime: "6 min read",
      image: "https://readdy.ai/api/search-image?query=Split%20screen%20comparison%20showing%20carbon%20neutral%20factory%20with%20green%20technology%20on%20one%20side%20and%20net%20zero%20facility%20with%20renewable%20energy%20systems%20on%20the%20other%20side%20with%20environmental%20metrics%20and%20sustainability%20indicators&width=600&height=400&seq=featured-2&orientation=landscape",
      featured: true
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
              <i className="ri-star-fill text-blue-500"></i>
              Featured Articles
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Articles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">In-depth analysis and expert perspectives on sustainability trends</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                <div className="relative">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">{article.category}</span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors">
                    <Link href={`/blog/${article.id}`} className="cursor-pointer">
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-semibold">
                          {article.author.split(' ').map(name => name[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{article.author}</p>
                        <p className="text-xs text-gray-500">{article.date}</p>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/blog/${article.id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Read More
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import Link from 'next/link';

export default function RecentArticles() {
  const recentArticles = [
    {
      id: 3,
      title: "Implementing Circular Economy Principles in Manufacturing",
      excerpt: "Practical strategies for manufacturers to transition from linear to circular business models, reducing waste and increasing resource efficiency.",
      category: "Circular Economy",
      author: "Dr. Emily Rodriguez",
      date: "December 10, 2024",
      readTime: "7 min read",
      image: "https://readdy.ai/api/search-image?query=Modern%20manufacturing%20facility%20showcasing%20circular%20economy%20principles%20with%20recycling%20systems%20waste%20reduction%20processes%20and%20sustainable%20production%20lines%20with%20green%20technology%20and%20environmental%20efficiency%20indicators&width=400&height=250&seq=recent-1&orientation=landscape"
    },
    {
      id: 4,
      title: "Renewable Energy Investment Trends in 2024",
      excerpt: "Analysis of global renewable energy investments, emerging technologies, and market opportunities shaping the clean energy transition.",
      category: "Renewable Energy",
      author: "James Wilson",
      date: "December 8, 2024",
      readTime: "5 min read",
      image: "https://readdy.ai/api/search-image?query=Large%20scale%20renewable%20energy%20installation%20with%20solar%20panels%20wind%20turbines%20and%20energy%20storage%20systems%20showing%20investment%20trends%20and%20financial%20growth%20charts%20with%20clean%20energy%20infrastructure%20and%20market%20analytics&width=400&height=250&seq=recent-2&orientation=landscape"
    },
    {
      id: 5,
      title: "Supply Chain Transparency: Tools and Technologies",
      excerpt: "Comprehensive guide to supply chain transparency solutions, including blockchain, IoT sensors, and AI-powered tracking systems.",
      category: "Supply Chain",
      author: "Lisa Park",
      date: "December 5, 2024",
      readTime: "6 min read",
      image: "https://readdy.ai/api/search-image?query=Digital%20supply%20chain%20transparency%20dashboard%20showing%20real-time%20tracking%20of%20goods%20with%20blockchain%20technology%20IoT%20sensors%20and%20AI%20analytics%20displaying%20sustainable%20sourcing%20and%20ethical%20manufacturing%20processes&width=400&height=250&seq=recent-3&orientation=landscape"
    },
    {
      id: 6,
      title: "Water Conservation Strategies for Industrial Operations",
      excerpt: "Effective water management techniques for industrial facilities, including recycling systems, efficiency improvements, and regulatory compliance.",
      category: "Environmental Management",
      author: "Dr. Robert Kim",
      date: "December 3, 2024",
      readTime: "8 min read",
      image: "https://readdy.ai/api/search-image?query=Industrial%20water%20conservation%20facility%20with%20advanced%20filtration%20systems%20recycling%20equipment%20and%20water%20treatment%20technology%20showing%20sustainable%20water%20management%20processes%20and%20environmental%20monitoring%20systems&width=400&height=250&seq=recent-4&orientation=landscape"
    },
    {
      id: 7,
      title: "Green Building Certifications: A Comprehensive Guide",
      excerpt: "Overview of major green building certification programs, their requirements, benefits, and impact on property value and sustainability.",
      category: "Green Building",
      author: "Maria Santos",
      date: "November 30, 2024",
      readTime: "9 min read",
      image: "https://readdy.ai/api/search-image?query=Modern%20sustainable%20green%20building%20with%20LEED%20certification%20features%20including%20solar%20panels%20green%20roof%20energy%20efficient%20windows%20and%20sustainable%20materials%20showcasing%20environmental%20architecture%20and%20green%20building%20standards&width=400&height=250&seq=recent-5&orientation=landscape"
    },
    {
      id: 8,
      title: "Corporate Sustainability Reporting: Best Practices",
      excerpt: "Essential guidelines for creating comprehensive sustainability reports that meet stakeholder expectations and regulatory requirements.",
      category: "ESG Reporting",
      author: "David Thompson",
      date: "November 28, 2024",
      readTime: "7 min read",
      image: "https://readdy.ai/api/search-image?query=Corporate%20sustainability%20report%20presentation%20with%20business%20executives%20reviewing%20ESG%20metrics%20environmental%20data%20charts%20and%20sustainability%20performance%20indicators%20in%20a%20professional%20boardroom%20setting&width=400&height=250&seq=recent-6&orientation=landscape"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full text-sm text-cyan-700 mb-4">
              <i className="ri-time-line text-cyan-500"></i>
              Latest Research
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Recent Articles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Latest insights and research from our sustainability experts</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <article key={article.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover object-top"
                />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{article.category}</span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${article.id}`} className="cursor-pointer">
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
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
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              Load More Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

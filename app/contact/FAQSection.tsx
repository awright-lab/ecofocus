
'use client';

import { useState } from 'react';

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is your typical response time for inquiries?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, our quick response team can provide same-day support."
    },
    {
      question: "Do you offer custom research services?",
      answer: "Yes, we provide custom research tailored to your specific sustainability needs. Our team can design comprehensive studies focusing on your industry, region, or particular environmental challenges."
    },
    {
      question: "Can I schedule a consultation call?",
      answer: "Absolutely! We offer free 30-minute consultation calls to discuss your sustainability goals and how our research can help. Use the contact form to request a call or phone us directly."
    },
    {
      question: "What types of reports do you publish?",
      answer: "We publish comprehensive sustainability reports including ESG analysis, carbon footprint studies, renewable energy market research, supply chain sustainability assessments, and industry-specific environmental impact reports."
    },
    {
      question: "Do you work with small businesses?",
      answer: "Yes, we work with organizations of all sizes. We offer scalable solutions designed to meet the needs and budgets of small businesses, startups, and large corporations alike."
    },
    {
      question: "How do I access purchased reports?",
      answer: "After purchase, you'll receive immediate access to digital reports through our secure client portal. Physical copies can be shipped upon request for an additional fee."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
            <i className="ri-question-line text-emerald-500"></i>
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Got Questions?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our services, reports, and how we can help your sustainability journey.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all cursor-pointer"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`ri-${openFAQ === index ? 'subtract' : 'add'}-line text-white text-sm`}></i>
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 bg-gradient-to-r from-emerald-50/50 to-emerald-100/50">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">Our team is here to help you find the right sustainability solutions for your organization.</p>
            <a href="#contact-form" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              Get in Touch
              <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

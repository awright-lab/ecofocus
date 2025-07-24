
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState('annual');

  const plans = [
    {
      name: 'Individual',
      description: 'Perfect for researchers and consultants',
      price: billingPeriod === 'annual' ? '$2,995' : '$299',
      period: billingPeriod === 'annual' ? 'per year' : 'per month',
      features: [
        'Access to 50 reports per year',
        'Basic market research',
        'Email support',
        'PDF downloads',
        'Basic analytics dashboard'
      ],
      cta: 'Start Individual Plan',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for small to medium businesses',
      price: billingPeriod === 'annual' ? '$7,995' : '$799',
      period: billingPeriod === 'annual' ? 'per year' : 'per month',
      features: [
        'Access to 150 reports per year',
        'Premium market research',
        'Priority support',
        'Multiple format downloads',
        'Advanced analytics dashboard',
        'Custom report requests (2/year)',
        'Team collaboration tools'
      ],
      cta: 'Start Professional Plan',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations and institutions',
      price: billingPeriod === 'annual' ? '$19,995' : '$1,999',
      period: billingPeriod === 'annual' ? 'per year' : 'per month',
      features: [
        'Unlimited report access',
        'All premium features',
        'Dedicated account manager',
        'White-label options',
        'API access',
        'Custom research projects',
        'Training and workshops',
        'Multi-user licenses'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
              <i className="ri-price-tag-3-line text-emerald-500"></i>
              Flexible Pricing Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Flexible pricing options designed to scale with your research needs and sustainability goals</p>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  billingPeriod === 'monthly' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  billingPeriod === 'annual' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border transition-all hover:shadow-xl transform hover:scale-105 ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-emerald-600">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <i className="ri-check-line text-emerald-500 text-xl mr-3 flex-shrink-0 mt-0.5"></i>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/checkout'} className={`w-full py-4 px-6 rounded-full font-semibold transition-all text-center block whitespace-nowrap cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                      : 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                  }`}>
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our team can create a tailored plan that perfectly fits your organization's unique research requirements and budget constraints.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                Contact us for custom pricing
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

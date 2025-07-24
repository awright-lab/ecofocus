
'use client';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <i className="ri-customer-service-2-line text-white text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
        </div>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Ready to discuss your sustainability goals? Our team of experts is here to help you navigate the complex world of environmental data and reporting.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ri-phone-line text-white text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ri-mail-line text-white text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600">info@ecofocus.com</p>
              <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-line text-white text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600">
                123 Sustainability Boulevard<br />
                Green City, NY 10001<br />
                United States
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ri-time-line text-white text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl border border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <i className="ri-flashlight-line text-white text-lg"></i>
          </div>
          <h3 className="font-semibold text-gray-900">Quick Response Team</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          For urgent sustainability reporting needs or time-sensitive research requests, contact our dedicated response team:
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="tel:+1-555-9999" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center whitespace-nowrap cursor-pointer">
            Emergency: +1 (555) 999-9999
          </a>
          <a href="mailto:urgent@ecofocus.com" className="bg-white/80 backdrop-blur-sm border border-emerald-300 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 hover:border-emerald-400 transition-all text-center whitespace-nowrap cursor-pointer">
            urgent@ecofocus.com
          </a>
        </div>
      </div>
    </div>
  );
}

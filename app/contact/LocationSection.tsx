
'use client';

export default function LocationSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-4">
            <i className="ri-map-pin-line text-emerald-500"></i>
            Visit Our Office
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Location
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Visit our headquarters in the heart of Green City, where our team of sustainability experts develops cutting-edge research and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="ri-building-line text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Office Details</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-building-2-line text-white text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">EcoFocus Research HQ</p>
                  <p className="text-sm text-gray-600">15th Floor, Sustainability Tower</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-car-line text-white text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Parking Available</p>
                  <p className="text-sm text-gray-600">Underground garage with EV charging</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-train-line text-white text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Public Transport</p>
                  <p className="text-sm text-gray-600">2 blocks from Green City Metro Station</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <i className="ri-information-line text-white text-sm"></i>
                </div>
                <h4 className="font-semibold text-emerald-900">Visitor Information</h4>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed">
                Please schedule appointments in advance. All visitors must check in at the main reception on the ground floor.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.681138573165!2d-73.98633908459394!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1609459200000!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EcoFocus Research Office Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

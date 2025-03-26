import React from "react";

function Services() {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 w-full">
          SERVICES
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="service-card p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Real-Time Flood Monitoring
            </h3>
            <p className="text-gray-600 mb-6">
              FlowX was created with a clear purpose: to protect lives and
              property from the devastating impact of floods in Sri Lanka. We
              are dedicated to providing advanced technological solutions that
              empower both residents and authorities with the information they
              need to make life-saving decisions during flood events.
            </p>
          </div>

          <div className="service-card p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Flood Forecasting and Warning System
            </h3>
            <p className="text-gray-600 mb-6">
              Access real-time flood prediction alerts specific to the Kalutara
              district, powered by data from Sri Lanka's Irrigation and
              Meteorology Departments. Our system analyzes rainfall patterns,
              water levels, and geographical factors to provide accurate and
              timely warnings before disaster strikes. These targeted
              predictions help residents and authorities prepare effectively,
              reducing the risk of loss of life and property damage during
              flooding events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;

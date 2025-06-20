import React from "react";
import { useState, useEffect } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    donationType: "",
    message: "",
    divisional_secretariat_id: ""
  });
  const [divisionalSecretariats, setDivisionalSecretariats] = useState([]);

  useEffect(() => {
    fetch("/api/area/divisional-secretariats-all")
      .then((res) => res.json())
      .then((data) => setDivisionalSecretariats(data.data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Map frontend fields to backend expected payload
    const payload = {
      fullname: formData.name,
      donation_email: formData.email,
      donation_phone_number: formData.phone,
      category: formData.donationType,
      message: formData.message,
      divisional_secretariat_id: formData.divisional_secretariat_id ? Number(formData.divisional_secretariat_id) : undefined
    };
    try {
      const response = await fetch("/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // Success logic here (show a message, etc.)
        setFormData({
          name: "",
          email: "",
          subject: "",
          phone: "",
          donationType: "",
          message: "",
          divisional_secretariat_id: ""
        });
      } else {
        // Handle error (show error message)
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // Handle error (show error message)
    }
  };
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          DONATE NOW
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information Card */}
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-6">Contact Information for Donations</h3>

            <div className="space-y-4">
              <p className="flex items-start">
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <span className="flex-1">Galle, 80000, Sri Lanka</span>
              </p>

              <p className="flex items-start">
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </span>
                <span className="flex-1">+94 740455459</span>
              </p>

              <p className="flex items-start">
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span className="flex-1">admin@flowx.co.id</span>
              </p>

              <p className="flex items-start">
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5"
                    />
                  </svg>
                </span>
                <span className="flex-1">flowx.co.id</span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="form-group">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group md:col-span-2">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter message subject"
                />
              </div>

              <div className="form-group md:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+94 XXXXXXXXX"
                />
              </div>

             
              <div className="form-group md:col-span-2">
                <label
                  htmlFor="donationType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Donation
                </label>
                <select
                  id="donationType"
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type of donation</option>
                  <option value="blood">Food & WaterDonations</option>
                  <option value="clothes">Clothes Donation</option>
                  <option value="shelter">Shelter Donation</option>
                  <option value="money">Money Donation</option>
                  <option value="food">Hygiene Supplies</option>
                  <option value="water">Medical Supplies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group md:col-span-2">
                <label
                  htmlFor="divisional_secretariat_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Divisional Secretariat
                </label>
                <select
                  id="divisional_secretariat_id"
                  name="divisional_secretariat_id"
                  value={formData.divisional_secretariat_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Divisional Secretariat</option>
                  {divisionalSecretariats.map((ds) => (
                    <option key={ds.divisional_secretariat_id} value={ds.divisional_secretariat_id}>
                      {ds.divisional_secretariat_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Submit Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

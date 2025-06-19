// ContactUs.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="relative bg-white py-16 px-6 max-w-3/4 mx-auto text-black overflow-hidden">
      {/* Logo background */}
      <img
        src="https://res.cloudinary.com/dkzcankyc/image/upload/v1750364419/lezme8r3sqzjbyzwnpea.png"
        alt="Swasthamana Logo Background"
        className="absolute fixed inset-0 w-full h-full object-contain opacity-5 z-0 pointer-events-none"
      />

      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-sky-700 mb-4 text-center"
        >
          Get in Touch with Swasthamana
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-gray-700 mb-10 max-w-2xl mx-auto"
        >
          Whether you have questions about your Ayurvedic treatment, need help with an appointment, or just want to understand more about holistic wellness, we're here to support you. Our team of dedicated professionals is always happy to hear from you.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-sky-600 text-2xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Email</h4>
                <a href="mailto:swasthamana@gmail.com" className="text-gray-700 hover:text-sky-600">swasthamana@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaPhoneAlt className="text-sky-600 text-2xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Phone</h4>
                <a href="tel:+919855001178" className="text-gray-700 hover:text-sky-600">+91-9855001178</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-sky-600 text-2xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Location</h4>
                <p className="text-gray-700">We are a 100% online Ayurvedic platform providing services across India and abroad. No physical clinic at present.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Our support team usually responds within 24–48 hours. Feel free to reach out for queries related to bookings, prescriptions, or general health advice.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 bg-opacity-80 p-8 rounded-2xl shadow-xl border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-sky-600">Send Us a Message</h3>
            <div>
              <label className="block mb-1 font-semibold">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Your Message</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition font-semibold shadow-md"
            >
              Send Message
            </button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-green-600 font-medium"
              >
                Thank you! We'll get back to you soon.
              </motion.p>
            )}
          </motion.form>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Swasthamana is committed to holistic health. For any inquiries or partnerships, you can also reach us through our official social channels or the support email above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
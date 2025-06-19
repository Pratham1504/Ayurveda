import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { server } from '../main';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/api/contact/message`, form);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error sending contact form:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="relative bg-white text-black py-16 px-4 sm:px-6 lg:px-8 lg:max-w-3/4 lg:mx-auto">
      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dkzcankyc/image/upload/v1750364419/lezme8r3sqzjbyzwnpea.png"
        alt="Swasthamana Logo Background"
        className="absolute fixed inset-0 w-full h-full object-contain opacity-5 z-0 pointer-events-none"
      />

      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-sky-700 text-center mb-4"
        >
          Get in Touch with Swasthamana
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10"
        >
          Whether you have questions about your Ayurvedic treatment, need help with an appointment, or just want to understand more about holistic wellness, we're here to support you.
        </motion.p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-sky-600 text-2xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Email</h4>
                <a href="mailto:swasthamana@gmail.com" className="text-gray-700 hover:text-sky-600">
                  swasthamana@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-sky-600 text-2xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Phone</h4>
                <a href="tel:+919855001178" className="text-gray-700 hover:text-sky-600">
                  +91 98550 01178
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-sky-600 text-2xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Location</h4>
                <p className="text-gray-700">
                  No physical clinic at present.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Our support team usually responds within 24–48 hours. Feel free to reach out for queries related to bookings, prescriptions, or general health advice.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
          >
            <h3 className="text-xl font-semibold text-sky-600">Send Us a Message</h3>

            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Message</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold transition"
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

        {/* Footer Note */}
        <div className="mt-16 text-center text-sm text-gray-500 leading-relaxed">
          <p>
            Swasthamana is committed to holistic health. For any inquiries or partnerships, you can also reach us through our official social channels or the support email above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

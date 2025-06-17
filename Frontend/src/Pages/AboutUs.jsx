import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCloudSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/SWASTHAMANA_no_bg.png';

const doctors = [
  {
    name: 'Dr. Surinder Kumar',
    qualification: 'MD (Ayurveda)',
    experience: '20+ years',
    description: `Specialized in chronic diseases and lifestyle disorders. Expert in Panchakarma, herbal medicine, and dietary regimens. Known for his compassionate and personalized approach.`,
    image: '../assets/1.jpg'
  },
  {
    name: 'Dr. Anju Garg',
    qualification: 'MD (Ayurveda)',
    experience: '18+ years',
    description: 'Specialist in gynaecological problems with a commitment to restoring women’s vitality through Ayurvedic wisdom.',
    image: '../assets/2.jpg'
  },
  {
    name: 'Dr. Ravinder',
    qualification: 'MD (Ayurveda)',
    experience: '15+ years',
    description: 'Specialist in Panchakarma and Agnikarma therapies, with expertise in treating musculoskeletal, liver, and joint disorders.',
    image: '../assets/3.webp'
  }
];

const features = [
  'Experienced & Certified Doctors',
  'Personalized Holistic Treatment Plans',
  'Panchakarma & Herbal Therapies',
  'Educational Blogs and eBooks',
  'Seamless Online Appointments'
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-24 bg-white text-black">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        
        <h1 className="text-5xl font-bold leading-tight">
          Dedicated to Your Health & <span className="text-sky-600">Wellness</span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto">
          "Swasthamana" comes from the Sanskrit words "Swastha" meaning "in one's natural balanced state" and "Mana" meaning "mind." At Swasthamana, our mission is to align the body and mind through the time-tested science of Ayurveda.
        </p>
        <p className="text-base max-w-2xl mx-auto">
          Our platform integrates traditional wisdom with modern technology to offer medicines, blogs, eBooks, and consultations from expert MD (Ayurveda) doctors — your complete Ayurvedic wellness hub.
        </p>
      </motion.section>
      {/* <img
        src={logo}
        alt="Swasthamana Logo"
        className="absolute left-1/2 top-1/2 opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ width: "400px", maxWidth: "80vw", zIndex: 0 }}
        aria-hidden="true"
      /> */}

      {/* Why Choose Section */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <img 
          src="https://images.unsplash.com/photo-1521146250551-a5578dcc2e64?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Ayurvedic care" 
          className="rounded-2xl shadow-xl w-full object-cover"
        />
        {/* LOGO */}
        {/* <img 
          src={logo}
          alt="Ayurvedic care" 
          className="rounded-2xl shadow-xl w-[30rem] object-cover"
        /> */}
        <div>
          <h2 className="text-4xl font-bold text-sky-700 mb-4">Why Choose Swasthamana?</h2>
          <p className="mb-6 text-lg">
            We are committed to bringing Ayurvedic healing into everyday life with compassion, care, and science.
          </p>
          <ul className="grid gap-3">
            {features.map((item, i) => (
              <li key={i} className="flex items-center text-base">
                <FaCheckCircle className="text-sky-600 mr-2" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Doctors Section */}
      <section>
        <h2 className="text-4xl font-bold text-center text-sky-700 mb-12">Meet Our Ayurvedic Experts</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doc, i) => (
            <motion.div 
              key={doc.name} 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-sky-100 text-center hover:shadow-2xl transition duration-300"
            >
              <img 
                src={doc.image} 
                alt={doc.name} 
                className="w-24 h-24 rounded-full mx-auto object-cover shadow-md border-2 border-sky-300"
              />
              <h3 className="text-xl font-semibold text-sky-800">{doc.name}</h3>
              <p className="text-sm font-medium text-sky-500">{doc.qualification} &middot; {doc.experience}</p>
              <p className="text-sm text-gray-700">{doc.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center bg-sky-50 p-12 rounded-xl"
      >
        <FaCloudSun className="text-5xl text-sky-500 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-sky-700">Get Expert Ayurvedic Care at Your Fingertips!</h3>
        <p className="mt-4 max-w-xl mx-auto text-lg">
          Access top Ayurvedic doctors, book appointments, explore holistic medicine, and download educational resources — all in one platform.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/consulting')} 
            className="bg-sky-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:bg-sky-700"
          >
            Book an Appointment
          </button>
          <button 
            onClick={() => navigate('/contact')} 
            className="border border-sky-600 text-sky-600 px-6 py-3 rounded-xl font-medium hover:bg-sky-100"
          >
            Contact Us
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;

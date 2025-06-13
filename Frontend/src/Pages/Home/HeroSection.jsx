import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="bg-[#e7f7fe] py-12 md:py-20 relative overflow-hidden min-h-[80vh] flex items-center justify-center">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 md:px-20">
      <div className="flex-1 mb-10 md:mb-0 md:mr-20 p-5">
        <h1 className="text-3xl md:text-5xl font-bold text-[#2d2350] mb-4 leading-tight">
          Consult a doctor anytime, anywhere <br className="hidden md:block" />
          <span className="text-sky-600">by video call</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-6 max-w-xl">
          Connect Instantly with Expert Ayurvedic Doctors for Personalized
          Health Guidance Online.
        </p>
        <div className="flex flex-wrap gap-4 mb-6">
          <Link to="/consulting">
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md font-semibold shadow transition">
              Ask A Doctor Online
            </button>
          </Link>
          <Link to="/products">
            <button className="bg-white border border-sky-600 text-sky-600 px-6 py-2 rounded-md font-semibold shadow hover:bg-sky-50 transition">
              Explore Herbal Remedies
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex justify-end items-end h-full">
        <div className="flex items-center justify-end  lg:w-[31rem] sm:w-[15rem]">
          <img
            src="../assets/456.png"
            className="w-full h-full drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

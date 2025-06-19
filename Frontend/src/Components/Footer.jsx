import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul>
              <li>
                <Link to="/products" className="hover:text-green-400">Products</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-green-400">Blogs</Link>
              </li>
              <li>
                <Link to="/consulting" className="hover:text-green-400">Consultation</Link>
              </li>
              <li>
                <Link to="/ebooks" className="hover:text-green-400">E-Books</Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Important Links</h3>
            <ul>
              <li>
                <Link to="/about" className="hover:text-green-400">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-green-400">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-green-400">Refund Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-green-400">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Social Media or Contact Info (Optional) */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <p>Follow us on social media or reach us directly:</p>
            <ul className="mt-2">
              <li>Email: <a href="mailto:swasthamana@gmail.com" className=" hover:text-sky-200">swasthamana@gmail.com</a></li>
              <li>Phone: <a href="tel:+919855001178" className="hover:text-sky-200">+91-98550 01178</a></li>
              <li>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/swasthamana_" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; 2025 Swasthamana. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

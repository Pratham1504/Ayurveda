import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-xl font-bold text-green-600">Ayurveda Clinic</a>
            </div>
            {/* Links for larger screens */}
            <div className="hidden md:flex space-x-4 ml-10">
              <a href="/" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/products" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Products</a>
              <a href="/consulting" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Consulting</a>
              <a href="/blogs" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Blogs</a>
              <a href="/ebooks" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">E-Books</a>
              <a href="/about" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-200 p-2 rounded-md inline-flex items-center justify-center text-gray-600 hover:bg-gray-300 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu items */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/products" className="block text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium">Products</a>
            <a href="/consulting" className="block text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium">Consulting</a>
            <a href="/blogs" className="block text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium">Blogs</a>
            <a href="/ebooks" className="block text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium">E-Books</a>
            <a href="/about" className="block text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium">About</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

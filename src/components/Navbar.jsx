import React, { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-800">CushLearn</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Courses</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Contact Us</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">About</a>
          </nav>
          
          <div className="hidden md:block">
            <button className="bg-indigo-800 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
              Get Started
            </button>
          </div>
          
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu - moved inside header to ensure it's part of the sticky element */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-2 shadow-inner">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium py-2">Home</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium py-2">Features</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium py-2">Courses</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium py-2">Contact Us</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium py-2">About</a>
              <button className="bg-indigo-800 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition w-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
import React from 'react';

export default function Hero() {
  return (
    <div className="background min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="px-8 py-16 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className=" space-y-8">
            <div className="text-teal-600 inline-block bg-white  px-4 py-2 rounded-full text-sm font-medium">
              ENHANCE YOUR CAREER
            </div>
            
            <h1 className="text-white text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Education with CushLearn 
            </h1>
            
            <p className="text-white text-lg opacity-90 max-w-md">
                Innovative learning platform for Cushitic language communities.
                Bridging knowledge gaps through accessible, multilingual education.
            </p>
            
            <div className="flex space-x-4">
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
                Get started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all">
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-4 pt-8">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">👤</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">👤</span>
                </div>
                <div className="w-10 h-10 bg-pink-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <div className="text-white">
                <div className="font-bold">50,000+ Learners</div>
                <div className="text-sm opacity-80">Join our community</div>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-96 lg:h-[500px]">
            {/* Main Card - Woman with laptop */}
            <div className="absolute top-0 left-8 w-64 h-80 bg-white rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="p-6 h-full flex flex-col">
                <div className="flex-1 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-2">
                      <div className="w-8 h-8 bg-teal-500 rounded-full mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  {/* Simulated person */}
                  <div className="absolute top-8 right-8 w-16 h-16 bg-gray-600 rounded-full"></div>
                  <div className="absolute top-12 right-12 w-8 h-8 bg-white rounded-full opacity-80"></div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">UX Designer</div>
                </div>
              </div>
            </div>

            {/* Top Right Card */}
            <div className="absolute top-8 right-0 w-48 h-56 bg-white rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="p-4 h-full flex flex-col">
                <div className="flex-1 bg-gray-100 rounded-xl mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300"></div>
                  <div className="absolute top-3 left-3 w-10 h-10 bg-blue-600 rounded-full"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="h-1.5 bg-white rounded mb-1 opacity-80"></div>
                    <div className="h-1.5 bg-white rounded w-2/3 opacity-60"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 text-sm">Mike Chen</div>
                  <div className="text-xs text-gray-500">Developer</div>
                </div>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute bottom-0 right-12 w-44 h-52 bg-white rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="p-4 h-full flex flex-col">
                <div className="flex-1 bg-gray-100 rounded-xl mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-600 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-2 opacity-90">
                      <div className="h-1 bg-gray-300 rounded mb-1"></div>
                      <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 text-sm">Alex Rivera</div>
                  <div className="text-xs text-gray-500">Data Analyst</div>
                </div>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-16 left-0 w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-4 w-2 h-2 bg-white bg-opacity-40 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-32 right-8 w-4 h-4 bg-white bg-opacity-20 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-lg"></div>
    </div>
  );
}
import React from 'react'

export default function Hero() {
  return (
    <div>
        <section className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white py-16">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Elevate Education with CushLearn Excellence</h1>
                <p className="text-lg mb-6">Innovative learning platform for Cushitic language communities. Bridging knowledge gaps through accessible, multilingual education.</p>
                <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Offline Access</span>
                </div>
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Multilingual Content</span>
                </div>
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>AI-Powered Translation</span>
                </div>
                </div>
                <div className="flex flex-wrap gap-3">
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-md flex items-center transition">
                    Get Started Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-800 text-white font-medium px-6 py-3 rounded-md flex items-center transition">
                    Learn More
                </button>
                </div>
            </div>
            <div className="md:w-1/2">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                <img src="/api/placeholder/600/400" alt="Dashboard preview" className="rounded-lg w-full" />
                <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-indigo-100 p-3 rounded-lg text-center">
                    <div className="text-indigo-800 font-bold text-xl">15,000+</div>
                    <div className="text-gray-600 text-sm">Students</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg text-center">
                    <div className="text-indigo-800 font-bold text-xl">220+</div>
                    <div className="text-gray-600 text-sm">Courses</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg text-center">
                    <div className="text-indigo-800 font-bold text-xl">98%</div>
                    <div className="text-gray-600 text-sm">Satisfaction</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

import React from 'react'
import { ChevronDown,Play} from 'lucide-react';

export default function AppDownload() {
  return (
    <div>
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Schooling Reinvented</h2>
                <h3 className="text-xl text-indigo-700 mb-4">Download Our Mobile App Instantly!</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">Experience seamless learning in Cushitic languages with our comprehensive mobile application. Download now for iOS and Android.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="md:w-1/2 text-center md:text-left">
                <p className="text-gray-700 mb-6">Our app offers complete offline functionality, allowing learners to access educational content without an internet connection. Perfect for remote areas with limited connectivity.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                    <a href="#" className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.707,12c0-3.553-2.942-6.396-6.559-6.396c-3.716,0-6.559,2.843-6.559,6.396s2.843,6.396,6.559,6.396C14.765,18.396,17.707,15.553,17.707,12z M12,5.778c3.716,0,6.559,2.843,6.559,6.396S15.716,18.57,12,18.57s-6.559-2.843-6.559-6.396S8.284,5.778,12,5.778z" />
                        <path d="M10.741,9.122c-0.006-0.034-0.022-0.062-0.028-0.096c-0.159,0-0.131,0.128-0.131,0.128S10.72,9.122,10.741,9.122z" />
                        <path d="M13.119,9.122c0.022,0,0.159,0.032,0.159-0.096c0,0,0.028-0.128-0.131-0.128C13.141,8.932,13.125,9.088,13.119,9.122z" />
                        <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M15.193,15.844c-0.241,0.24-0.631,0.24-0.872,0l-1.362-1.362c-0.912,0.488-1.969,0.794-3.093,0.794c-3.682,0-6.667-2.985-6.667-6.667S6.184,2,9.866,2s6.667,2.985,6.667,6.667c0,1.124-0.306,2.181-0.794,3.093l1.362,1.362C17.345,13.365,17.345,13.754,15.193,15.844z" />
                    </svg>
                    App Store
                    </a>
                    <a href="#" className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.14,12c0-2.93,1.45-5.54,3.69-7.15c0.24-0.17,0.69-0.11,0.66,0.26c-0.19,1.95,0.38,3.37,1.09,4.45 c0.28,0.43,0.93,0.54,1.21,0.11C11.17,7.67,13.28,5,17.66,5c0.55,0,1,0.45,1,1v11.01c0,0.55-0.45,1-1,1c-4.02,0-6.01,2.37-7.34,4.2 c-0.23,0.31-0.71,0.32-0.93,0.04C7.88,19.97,3.14,16.43,3.14,12z" />
                    </svg>
                    Google Play
                    </a>
                </div>
                <div>
                    <img src="/api/placeholder/320/100" alt="QR code" className="mx-auto md:mx-0" />
                </div>
                </div>
                <div className="md:w-1/2">
                <img src="/api/placeholder/500/400" alt="Mobile app showcase" className="mx-auto" />
                </div>
            </div>
            </div>
        </section>

        {/* Video Section */}
        <section className="py-16 bg-indigo-900 text-white">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Explore CushLearn's Innovative Features</h2>
            <div className="relative max-w-3xl mx-auto rounded-xl overflow-hidden">
                <img src="/api/placeholder/800/450" alt="Feature video thumbnail" className="w-full" />
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-indigo-900 rounded-full p-4 hover:bg-indigo-100 transition">
                <Play className="w-8 h-8" />
                </button>
            </div>
            <button className="mt-8 bg-white text-indigo-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                Watch More
            </button>
            </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">EdTech Bridging Gaps, Building Futures</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Learn how our platform is transforming education in Cushitic language communities.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src="/api/placeholder/400/250" alt="Blog post" className="w-full" />
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">CushLearn Bridging Gaps, Building Futures with WhatsApp</h3>
                    <p className="text-gray-600 mb-4">Discover how our WhatsApp integration allows learners in remote areas to access education.</p>
                    <button className="text-indigo-700 font-medium flex items-center hover:underline">
                    Read More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src="/api/placeholder/400/250" alt="Blog post" className="w-full" />
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">CushLearn Supporting Student Learning Through AI Translation</h3>
                    <p className="text-gray-600 mb-4">How our AI-powered translation tools help bridge the language gap for educational content.</p>
                    <button className="text-indigo-700 font-medium flex items-center hover:underline">
                    Read More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src="/api/placeholder/400/250" alt="Blog post" className="w-full" />
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">Offline Learning Features Empower Rural Communities</h3>
                    <p className="text-gray-600 mb-4">How our offline functionality is bringing education to areas with limited connectivity.</p>
                    <button className="text-indigo-700 font-medium flex items-center hover:underline">
                    Read More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                </div>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

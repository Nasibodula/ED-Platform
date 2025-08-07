import React from 'react'
import { ChevronDown} from 'lucide-react';

export default function PlatformFeatures() {
  return (
    <div>
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Elevate Education with CushLearn's<br />Power-Packed Capabilities</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Our platform bridges linguistic divides to make education accessible to all. CushLearn's multi-language support enables seamless learning in Oromo, Borana, and English.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h3>
                <p className="text-gray-600 mb-6">Track your learning progress at a glance. Personalized recommendations based on your education goals and easily access your courses offline.</p>
                <button className="text-teal-700 font-medium flex items-center hover:underline">
                    Learn More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                </div>
                <div className="bg-gray-100 p-6 rounded-xl shadow">
                <img src="/assets/images/studentdashboard.png" alt="Dashboard interface" className="rounded-lg w-full" />
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Translator</h3>
                <p className="text-gray-600 mb-4">Work on the go with our mobile-friendly interface. Translate content anytime, anywhere even offline, right from your device.</p>
                <img src="/assets/images/translator.png" alt="Mobile interface" className="rounded-lg w-full mb-4 w-3" />
                <button className="text-teal-700 font-medium flex items-center hover:underline">
                    Learn More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics</h3>
                <p className="text-gray-600 mb-4">Track your progress with detailed analytics. Set goals and measure your performance against benchmarks.</p>
                <img src="/assets/images/studentdashboard.png" alt="Analytics interface" className="rounded-lg w-full mb-4" />
                <button className="text-teal-700 font-medium flex items-center hover:underline">
                    Learn More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Courses</h3>
                <p className="text-gray-600 mb-4">Explore our extensive library of courses in multiple languages tailored to Cushitic communities.</p>
                <img src="/assets/images/Courses.png" alt="Courses interface" className="rounded-lg w-full mb-4" />
                <button className="text-teal-700 font-medium flex items-center hover:underline">
                    Learn More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

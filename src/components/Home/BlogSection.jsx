import React from 'react'
import { ChevronDown} from 'lucide-react';

export default function BlogSection() {
  return (
    <div>
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">EdTech Bridging Gaps, Building Futures</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Learn how our platform is transforming education in Cushitic language communities.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src="/assets/images/BlogPost1.jpg" alt="Blog post" className="w-full" />
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">CushLearn Bridging Gaps, Building Futures with WhatsApp</h3>
                    <p className="text-gray-600 mb-4">Discover how our WhatsApp integration allows learners in remote areas to access education.</p>
                    <button className="text-teal-700 font-medium flex items-center hover:underline">
                    Read More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src="/assets/images/BlogPost2.jpg" alt="Blog post" className="w-full" />
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">CushLearn Supporting Student Learning Through AI Translation</h3>
                    <p className="text-gray-600 mb-4">How our AI-powered translation tools help bridge the language gap for educational content.</p>
                    <button className="text-teal-700 font-medium flex items-center hover:underline">
                    Read More 
                    <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src="/assets/images/BlogPost3.jpg" alt="Blog post" className="w-full" />
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">Offline Learning Features Empower Rural Communities</h3>
                    <p className="text-gray-600 mb-4">How our offline functionality is bringing education to areas with limited connectivity.</p>
                    <button className="text-teal-700 font-medium flex items-center hover:underline">
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

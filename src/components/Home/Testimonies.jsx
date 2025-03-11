import React from 'react'


export default function Testimonies() {
  return (
    <div>
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Testimonials: Unveiling CushLearn's Influence</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Hear from our users about how CushLearn has transformed their educational journey.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                    <img src="/api/placeholder/60/60" alt="User" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                    <h4 className="font-bold text-gray-800">Abdi Hassan</h4>
                    <p className="text-gray-600 text-sm">Student</p>
                    </div>
                </div>
                <p className="text-gray-700">"I never thought I could access quality education in my native Oromo language. CushLearn has made it possible for me to learn mathematics and science concepts without language barriers."</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                    <img src="/api/placeholder/60/60" alt="User" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                    <h4 className="font-bold text-gray-800">Fatima Omar</h4>
                    <p className="text-gray-600 text-sm">Teacher</p>
                    </div>
                </div>
                <p className="text-gray-700">"As an educator in a rural community, CushLearn has revolutionized how I deliver content to my students. The offline capabilities mean we can learn even without reliable internet."</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                    <img src="/api/placeholder/60/60" alt="User" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                    <h4 className="font-bold text-gray-800">Ahmed Mohamed</h4>
                    <p className="text-gray-600 text-sm">Parent</p>
                    </div>
                </div>
                <p className="text-gray-700">"My children's educational experience has been transformed with CushLearn. The multilingual support means they can learn in our native language while also improving their English skills."</p>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                <button className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                Read More Success Stories
                </button>
            </div>
            </div>
        </section>
    </div>
  )
}

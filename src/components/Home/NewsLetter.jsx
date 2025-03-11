import React from 'react'

export default function NewsLetter() {
  return (
    <div>
        <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Stay Updated with CushLearn</h2>
                <p className="text-gray-600">Subscribe to our newsletter for the latest updates, educational resources, and community news.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                    Subscribe
                </button>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

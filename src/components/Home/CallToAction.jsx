import React from 'react'

export default function CallToAction() {
  return (
    <div>
        <section className="py-16 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Embark on Your Learning Journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of learners who are breaking language barriers with CushLearn's innovative educational platform.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                Get Started for Free
                </button>
                <button className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-800 text-white px-6 py-3 rounded-lg font-medium transition">
                Request a Demo
                </button>
            </div>
            </div>
        </section>  
    </div>
  )
}

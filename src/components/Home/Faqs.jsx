import React from 'react'


export default function Faqs() {
  return (
    <div>
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about CushLearn's educational platform.</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">How does the offline functionality work?</h3>
                    <p className="text-gray-700">Our app allows you to download course content when you have internet access, which can then be accessed later when offline. All course materials, including videos, are optimized for offline use.</p>
                </div>
                </div>
                
                <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">Which Cushitic languages are supported?</h3>
                    <p className="text-gray-700">We currently support Oromo, Borana, Somali, and Afar languages, with plans to add more Cushitic languages in the future. Our AI translation technology helps bridge gaps between these languages and English.</p>
                </div>
                </div>
                
                <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">Can I create content in my native language?</h3>
                    <p className="text-gray-700">Yes! CushLearn encourages community contributions. Educators can create and upload content in Cushitic languages, which our platform can then translate to other supported languages.</p>
                </div>
                </div>
                
                <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">Is the WhatsApp integration available in all regions?</h3>
                    <p className="text-gray-700">Yes, our WhatsApp learning feature works globally. As long as you have WhatsApp access, you can receive educational content and interact with our AI tutor through the messaging platform.</p>
                </div>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

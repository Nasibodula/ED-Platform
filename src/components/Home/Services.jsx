import React from 'react'
import {Globe,Award,MessageSquare, Mail, PhoneCall } from 'lucide-react';

export default function Services() {
  return (
    <div>
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Vision, Our Solution: Customized for Excellence</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">We provide a comprehensive suite of tools to make learning in Cushitic languages accessible, engaging, and effective.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">WhatsApp</h3>
                    <p className="text-gray-600 text-sm">Learn on the go with WhatsApp integration for easy access to educational content.</p>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Remote</h3>
                    <p className="text-gray-600 text-sm">Access education anywhere with our remote learning capabilities and offline content.</p>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Talk</h3>
                    <p className="text-gray-600 text-sm">Practice language skills with our AI-powered conversation tools in multiple languages.</p>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Online Payment</h3>
                    <p className="text-gray-600 text-sm">Secure and flexible payment options for premium educational content.</p>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Recording</h3>
                    <p className="text-gray-600 text-sm">Record and review lessons for later reference, even when offline.</p>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <PhoneCall className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Virtual Chat</h3>
                    <p className="text-gray-600 text-sm">Connect with tutors and fellow learners through our integrated chat system.</p>
                </div>
                </div>
            </div>
            
            <div className="text-center mt-8">
                <button className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                Contact Us Now
                </button>
            </div>
            </div>
        </section>
    </div>
  )
}

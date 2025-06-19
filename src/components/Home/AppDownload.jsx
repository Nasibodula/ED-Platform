import React from 'react'
import { ChevronDown,Play} from 'lucide-react';

export default function AppDownload() {
  return (
    <div>
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Schooling Reinvented</h2>
                <h3 className="text-xl text-teal-700 mb-4">Download Our Mobile App Instantly!</h3>
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
    </div>
  )
}


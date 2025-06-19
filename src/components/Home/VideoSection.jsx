import React from 'react'
import {Play} from 'lucide-react';

export default function VideoSection() {
  return (
    <div>
        <section className="py-16 bg-teal-900 text-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Explore CushLearn's Innovative Features</h2>
            <div className="relative max-w-3xl mx-auto rounded-xl overflow-hidden">
              <iframe  
                width="800" 
                height="450" 
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
                title="Video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
            <button className="mt-8 bg-white text-teal-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
            Watch More
            </button>
        </div>
        </section>
    </div>
  )
}

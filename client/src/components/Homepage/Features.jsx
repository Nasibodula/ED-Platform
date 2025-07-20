import React from 'react'
import {Book, Globe, Users} from 'lucide-react';

export default function Features() {
  return (
    <div>
        <section className="py-16 bg-teal-950 text-white">
            <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Choose CushLearn: Your Path to Educational Excellence</h2>
            <p className="max-w-2xl mx-auto text-teal-200">Our platform breaks down language barriers to make quality education accessible to all Cushitic language communities.</p>
            </div>
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg">
                <div className="text-teal-400 mb-4 flex justify-center">
                <Globe className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-3">Efficiency</h3>
                <p className="text-teal-200">Advanced AI translation between Cushitic languages and English enables seamless educational engagement.</p>
            </div>
            <div className="text-center p-6 rounded-lg">
                <div className="text-teal-400 mb-4 flex justify-center">
                <Book className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-3">Transparency</h3>
                <p className="text-teal-200">Open-source educational resources and clear learning paths empower student autonomy in knowledge management.</p>
            </div>
            <div className="text-center p-6 rounded-lg">
                <div className="text-teal-400 mb-4 flex justify-center">
                <Users className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-3">Inclusivity</h3>
                <p className="text-teal-200">Addressing the unique linguistic needs of Cushitic communities through inclusive design navigation.</p>
            </div>
            </div>
            <div className="container mx-auto px-4 flex justify-center mt-12">
            <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-teal-300">Supported Topics</div>
                </div>
                <div className="text-center">
                <div className="text-3xl font-bold">220+</div>
                <div className="text-teal-300">Happy Clients</div>
                </div>
                <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-teal-300">Client Satisfaction</div>
                </div>
                <div className="text-center">
                <div className="text-3xl font-bold">07+</div>
                <div className="text-teal-300">Modules</div>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

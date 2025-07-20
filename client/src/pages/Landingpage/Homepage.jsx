import React from 'react'
import Features from '../../components/Homepage/Features'
import PlatformFeatures from '../../components/Homepage/PlatformFeatures'
import Services from '../../components/Homepage/Services'
import AppDownload from '../../components/Homepage/AppDownload'
import VideoSection from '../../components/Homepage/VideoSection'
import BlogSection from '../../components/Homepage/BlogSection'
import Testimonies from '../../components/Homepage/Testimonies'
import Faqs from '../../components/Homepage/Faqs'
import CallToAction from '../../components/Homepage/CallToAction'
// import NewsLetter from '../../components/NewsLetter'
import Hero from '../../components/Homepage/Hero'
import Navbar from '../../components/Homepage/Navbar'


export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <Hero/>
      <Features/>
      <PlatformFeatures/>
      <Services/>
      <AppDownload/>
      <VideoSection/>
      <BlogSection/>
      <Testimonies/>
      <Faqs/>
      <CallToAction/>
    </div>
  )
}



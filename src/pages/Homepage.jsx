import React from 'react'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import PlatformFeatures from '../components/Home/PlatformFeatures'
import Services from '../components/Home/Services'
import AppDownload from '../components/Home/AppDownload'
import VideoSection from '../components/Home/VideoSection'
import BlogSection from '../components/Home/BlogSection'
import Testimonies from '../components/Home/Testimonies'
import Faqs from '../components/Home/Faqs'
import CallToAction from '../components/Home/CallToAction'
import NewsLetter from '../components/Home/NewsLetter'


export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
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
      <NewsLetter/>


    </div>
  )
}

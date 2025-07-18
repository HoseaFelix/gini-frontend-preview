import Features from '@/components/homepageComponents/features'
import Footer from '@/components/homepageComponents/footer'
import Hero from '@/components/homepageComponents/hero'
import Navbar from '@/components/homepageComponents/navbar'
import Pricing from '@/components/homepageComponents/pricing'
import Testimonials from '@/components/homepageComponents/testimonials'
import React from 'react'

const Page = () => {
  return (
    <div className=' w-screen min-h-screen relative'>
        <Navbar/>
        <Hero/>
        <Features/>
        <Pricing/>
        <Testimonials/>
        <Footer/>

      
    </div>
  )
}

export default Page

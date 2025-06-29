import Features from '@/components/homepage components/features'
import Footer from '@/components/homepage components/footer'
import Hero from '@/components/homepage components/hero'
import Navbar from '@/components/homepage components/navbar'
import Pricing from '@/components/homepage components/pricing'
import Testimonials from '@/components/homepage components/testimonials'
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

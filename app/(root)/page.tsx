import Features from '@/components/homepage components/features'
import Hero from '@/components/homepage components/hero'
import Navbar from '@/components/homepage components/navbar'
import React from 'react'

const Page = () => {
  return (
    <div className=' w-screen min-h-screen'>
        <Navbar/>

        <Hero/>
        <Features/>
      
    </div>
  )
}

export default Page

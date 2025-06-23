import Hero from '@/components/homepage components/hero'
import Navbar from '@/components/homepage components/navbar'
import React from 'react'

const Page = () => {
  return (
    <div className='relative w-full h-full flex flex-center'>
        <Navbar/>
        <Hero/>
      
    </div>
  )
}

export default Page

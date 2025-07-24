'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Button from '../generalComponents/button'
import Carousel from './carousel'

const Hero = () => {

  const [url, setUrl] = useState('')
  



  useEffect(()=>{
  
      
      const authString = localStorage.getItem('auth');
      const savedAuth = authString ? JSON.parse(authString) : null;
      if(savedAuth){
        setUrl('/dashboard')
        
        
      }else {
        setUrl('sign-in')
      }

  
  }, [url])
 
  

  return (
    <section className=' w-screen min-h-screen relative flex items-center justify-center overflow-x-hidden '>

    <div className="absolute inset-0 -z-10">
        <Image
          src="/img/hero-background.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
        />
        
      </div>

      <div className='w-full min-h-screen'>
       

        <div className='max-sm:h-max w-full min-h-screen blue-gradient-dark backdrop-blur-sm flex items-center justify-center pt-20 pb-10 px-4 md:px-20'>

          <div className='grid grid-cols-1 md:grid-cols-2 h-[70%] w-full gap-10 py-10 '>

            <div className='h-full w-full flex flex-col gap-5'>
                <div className='text-white text-3xl md:text-4xl lg:text-6xl capitalize flex gap-2 flex-col font-bold max-md:items-center'>

                  <p>the ultimate career</p> 
                  <p>companion for job</p>
                  <p>seekers to <span className='text-[#319F43]'>build,</span> </p> 
                  <p><span className='text-foreground'>optimize,</span> 
                   <span className='text-[#F8BD00]'> Track</span></p>

                </div>

                <div>
                  <p className='text-white font-bold text-lg lg:text-xl max-md:text-center  '>From resume creation to interview prep, we help you optimize every step of your job security journey</p>
                </div>

                <div className='flex w-full gap-5 md:w-fit max-md:justify-center max-sm:'>
                  <Button
                     
                    href={url}
                    title='get started'
                    containerClass='bg-[#F8BD00] text-text px-3 py-2 rounded-sm w-full md:w-fit '

                  />
                  <Button
                    href={url}
                    title='login'
                    containerClass='border-2 text-white px-3 py-1.5 rounded-sm w-full md:w-fit'

                  />

                </div>

                <div className='flex gap-10 max-md:justify-center'>
                  <div className='flex flex-col'>
                   
                    <p className='font-bold text-white text-2xl '>~ 20k </p>
                   <p className='text-sm text-white'>Average daily users</p>

                  </div>
                  <div className='flex flex-col'>
                   
                    <p className='font-bold text-white text-2xl '>89.6% </p>
                   <p className='text-sm text-white'>Rate of hired users</p>

                  </div>

                </div>
            </div>

            <div className='h-full w-full min-h-[400px] rounded-3xl shadow-xl overflow-hidden'>
              <Carousel/>
            </div>

          </div>

          

        </div>

      </div>


    </section>
  )
}

export default Hero

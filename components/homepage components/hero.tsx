import Image from 'next/image'
import React from 'react'
import Button from '../generalComponents/button'

const Hero = () => {
  return (
    <section className='w-dvw h-dvh relative flex items-center justify-center'>

        <Image 
          src='/img/hero-background.jpg'
          fill
          className='object-cover'
          alt='hero background'

        />

      <div className='w-full h-full absolute left-0 top-0'>
       

        <div className='w-full h-full blue-gradient-dark backdrop-blur-sm flex items-center justify-center px-20'>

          <div className='grid grid-cols-1 md:grid-cols-2 h-[70%] w-full gap-10 py-10 '>

            <div className='h-full w-full flex flex-col gap-5'>
                <div className='text-white text-4xl capitalize flex gap-2 flex-col font-bold'>

                  <p>the ultimate career</p> 
                  <p>companion for job</p>
                  <p>seekers to <span className='text-[#319F43]'>build,</span> </p> 
                  <p><span className='text-foreground'>optimize,</span> and 
                   <span className='text-[#F8BD00]'> Track</span></p>

                </div>

                <div>
                  <p className='text-white font-bold lg:text-lg '>From resume creation to interview prep, we help you <br /> optimize every step of your job security journey</p>
                </div>

                <div className='flex w-fit gap-5'>
                  <Button
                    href=''
                    title='get started'
                    containerClass='bg-foreground text-white px-3 py-2 rounded-sm '

                  />
                  <Button
                    href=''
                    title='login'
                    containerClass='border-2 text-white px-3 py-2 rounded-sm '

                  />

                </div>

                <div className='flex gap-10'>
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

          </div>

        </div>

      </div>


    </section>
  )
}

export default Hero

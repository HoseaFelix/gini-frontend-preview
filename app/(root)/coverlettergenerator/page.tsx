'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import SavedLetters from './components/SavedLetters'
import Overlay from './components/overlay/overlay'
import { useCurrentNav } from '@/store/store'

const Page = () => {
    useEffect(()=>{
      useCurrentNav.getState().setCurrentNav('Cover Letter Generator')
    },[])

  const [isPanelOpen, setPanelOpen] = useState(false)

  const handlePanelToggle = ()=>{
    setPanelOpen((prev)=> !prev)
  }

  return (
    <main className='flex flex-col gap-10 relative'>

      <div 
      
        onClick={handlePanelToggle}
        className='p-3 flex items-center gap-2 w-max bg-white  border-black border-1 rounded-lg shadow hover:cursor-pointer'>
          <div className='w-fit h-fit'>
              <Image
                className=''
                src='/icons/create.png'
                alt={`create new icon`}
                width={20}
                height={20}
              />
          </div>
          <p>Create New</p>
      
      </div>

      <SavedLetters/>

      <div className={`absolute left-0 top-0 w-full h-screen md:h-[75dvh] bg-white rounded-lg shadow-sm z-50 ${!isPanelOpen? 'hidden': ''}`}>
        <div className='w-full h-full flex flex-col gap-5 relative'>

          <div className=' mt-5 relative w-full h-fit flex items-center justify-center'>

            <div 
            onClick={handlePanelToggle}
            className='absolute right-8 w-fit'>
            <div className='p-4 flex items-center justify-center hover:cursor-pointer z-50'>
            <Image
              src="/icons/close.png"
              width={14}
              height={14}
              alt='close icon'
              className=''/>
            </div>
                           
          
            </div>

            <p className='font-bold text-lg'>Job Description</p>


          </div>

          <div className='w-full h-full'>
            <Overlay/>
          </div>



        </div>
        
      </div>
        
    </main>
  )
}

export default Page

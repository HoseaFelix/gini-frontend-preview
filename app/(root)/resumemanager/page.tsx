'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Notifications from '../dashboard/components/notifications'
import Savedresume from './components/savedresume'
import { useCurrentNav } from '@/store/store'
import UploadSequence from './components/uploadSequence'

const ResumePage = () => {

  const [isPanelOpen, setPanelOpen] = useState(false)

  const dummyNotifications = [
    {
      notification: 'dummy 1',
      severity: "important"
    },
    {
      notification: 'dummy 1',
      severity: "casual"
    },
    {
      notification: 'dummy 1',
      severity: "important"
    },
  ]

  const handlePanelToggle = ()=>{
      setPanelOpen((prev)=>!prev)
  }

  useEffect(()=>{
    useCurrentNav.getState().setCurrentNav('Resume Manager')
  },[])

  return (
    <div className='flex flex-col gap-10 relative pb-10'>
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

            <Notifications notifications={dummyNotifications}/>
            <Savedresume/>

            <div className={`absolute top-0 left-0 w-full h-max bg-white rounded-lg overflow-hidden pb-20 min-h-[60dvh] ${!isPanelOpen ? 'hidden' : ''}`}>
              <div className='w-full h-full flex flex-col relative py-10 px-4 items-center gap-5 '>
                <p className='font-bold text-text/70 text-xl'>Add New Resume</p>
                <div 
                      onClick={handlePanelToggle}
                      className='absolute top-8 right-8 w-fit'>
                  <div className='p-4 flex items-center justify-center hover:cursor-pointer z-50'>
                    <Image
                      src="/icons/close.png"
                      width={14}
                      height={14}
                      alt='close icon'
                      className=''
                      
                    />
                  </div>
                 

                </div>

                

                <div className='w-full h-max flex items-center justify-center'>
                  <UploadSequence/>

                </div>

                


              </div>

            </div>



    </div>
  )
}

export default ResumePage

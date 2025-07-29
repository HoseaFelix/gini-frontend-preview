'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Notifications from '../dashboard/components/notifications'
import Savedresume from './components/savedresume'
import { useCurrentNav } from '@/store/store'

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
    <div className='flex flex-col gap-10 relative'>
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

            <div className={`absolute top-0 left-0 w-full h-max bg-white rounded-lg overflow-hidden pb-20 ${!isPanelOpen ? 'hidden' : ''}`}>
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

                <div className='w-full h-fit lg:w-4xl mx-auto flex flex-nowrap gap-2 md:gap-5'>
                  <div className='h-2 w-full rounded-lg bg-blue-500 '></div>
                  <div className='h-2 w-full rounded-lg bg-text/60 '></div>
                  <div className='h-2 w-full rounded-lg bg-text/60 '></div>

                </div>

                <div className='flex flex-col md:flex-row gap-10 mt-20'>
                <div className='relative'>
                  <input 
                    id="fileUpload"
                    type="file" 
                    className='hidden' 
                    onChange={(e) => console.log(e.target.files)} 
                  />
                  <label htmlFor="fileUpload">
                    <div className='w-[200px] h-[200px] border rounded-lg border-text/50 flex items-center justify-center hover:cursor-pointer flex-col gap-3 pt-5'>
                      <div className='flex items-center justify-center p-2 rounded bg-text/30'>
                        <Image
                          src={"/icons/create.png"}
                          width={20}
                          height={20}
                          alt='create icon'
                        />
                      </div>
                      <p>Upload from local storage</p>
                    </div>
                  </label>
                </div>
                <div className='w-[200px] h-[200px] border rounded-lg border-text/50  items-center justify-center hover:cursor-pointer flex flex-col gap-3 pt-5'>
                      <div className='flex flex-col items-center justify-center p-2 rounded bg-text/30'>
                        <Image
                          src={"/icons/write.png"}
                          width={20}
                          height={20}
                          alt='create icon'
                        />
                      </div>
                      <p>Build from a template</p>

                    </div>


                </div>


              </div>

            </div>



    </div>
  )
}

export default ResumePage

'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Notifications from '../dashboard/components/notifications'
import Savedresume from './components/savedresume'
import { useCurrentNav } from '@/store/store'
import UploadSequence from './components/uploadSequence'
import Aihelp from './components/aihelp'

const ResumePage = () => {

  const [isPanelOpen, setPanelOpen] = useState(false)
  const [toggleChat, setToggleChat] = useState(false)

  const dummyNotifications = [
  ]

  const handleToggleChat = () => {
    setToggleChat((prev) => !prev)
  }
  const handlePanelToggle = () => {
    setPanelOpen((prev) => !prev)
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [uploadSequenceConfig, setUploadSequenceConfig] = useState<{ initialStep: number, initialResume: any } | null>(null)
  const [uploadKey, setUploadKey] = useState(0)

  const handleReOptimize = (resume: any) => {
    setUploadSequenceConfig({
      initialStep: 1, // Index 1 is the second slide (Description)
      initialResume: resume.data
    })
    setUploadKey(prev => prev + 1)
    setPanelOpen(true)
  }

  const handleCreateNew = () => {
    setUploadSequenceConfig(null)
    setUploadKey(prev => prev + 1)
    setPanelOpen(true)
  }

  useEffect(() => {
    useCurrentNav.getState().setCurrentNav('Resume Manager')
  }, [])

  return (
    <div className=' flex flex-col gap-10 relative pb-10 min-h-[80dvh] '>



      <Aihelp toggleChat={toggleChat} handleToggleChat={handleToggleChat} />


      <div
        onClick={handleToggleChat}
        className={`${toggleChat ? 'hidden' : ''} absolute left-2 bottom-5 w-max h-max hover:cursor-pointer z-150`}>
        <div className='p-4 w-max h-max flex gap-2 items-center bg-foreground rounded-lg group transition-all duration-300 '>
          <Image
            src={'/icons/comment.png'}
            width={30}
            height={30}
            alt='chat icon'
            className='invert'

          />
          <p className='group-hover:block hidden text-white font-bold '>Chat with AI</p>

        </div>

      </div>







      <div

        onClick={handleCreateNew}
        className='p-3 flex items-center gap-2 w-max bg-white  border-black border rounded-lg shadow hover:cursor-pointer'>
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

      <Notifications notifications={dummyNotifications} />
      <Savedresume onReOptimize={handleReOptimize} />

      <div className={`absolute top-0 left-0 w-full h-dvh md:h-[80dvh] bg-white rounded-lg overflow-hidden pb-5 min-h-[60dvh] ${!isPanelOpen ? 'hidden' : ''}`}>
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



          <div className='w-full h-full  flex items-center justify-center'>
            <UploadSequence
              key={uploadKey}
              initialStep={uploadSequenceConfig?.initialStep}
              initialResume={uploadSequenceConfig?.initialResume}
            />

          </div>




        </div>

      </div>



    </div>
  )
}

export default ResumePage

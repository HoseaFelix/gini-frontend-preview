'use client'

import UserData from '@/app/(root)/dashboard/components/userData'
import React, { useEffect } from 'react'
import Notifications from './components/notifications'
import QuickActions from './components/quickActions'
import RecentActivity from './components/recentActivity'
import BiggerNotification from './components/biggerNotification'
import Image from 'next/image'
import { useCurrentNav } from '@/store/store'

const Page = () => {

  const notifications = []

  useEffect(()=>{
    useCurrentNav.getState().setCurrentNav("Dashboard")
  }, [])

  return (
    <div className='w-full h-full relative flex flex-col gap-10 pb-20'>
      <UserData/>
      <Notifications notifications={notifications}/>
      <QuickActions/>
      <RecentActivity/>
      <BiggerNotification/>
      
      <div className=' lg:hidden fixed bottom-5 right-5 h-fit w-fit'>
        <div className='p-5 items-center justify-center bg-foreground rounded-lg hover:cursor-pointer'>
          <Image
            src='/icons/plus.png'
            height={28}
            width={28}
            alt='plus icon'
          />

        </div>

      </div>
      
    </div>
  )
}

export default Page

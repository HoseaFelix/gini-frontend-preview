import Link from 'next/link'
import React from 'react'

const BiggerNotification = () => {
    const recentActivities = [

    ]
  return (
    <div className='p-4 shadow rounded-xl bg-white flex flex-col gap-5'>
        <div className='flex justify-between py-4 '>
            <p className='font-bold text-xl'>Notifications</p>
            <Link href="" className='underline hover:cursor-pointer'>View More</Link>

            

        </div>
        {recentActivities.length > 0 ? (
                recentActivities.map((notification, index)=>(
                    <div key={index} className='flex justify-between p-4 hover:border hover:border-blue-500 border rounded-lg transition-colors hover:cursor-pointer'>
                        <p>{notification.notification}</p>
                        <p>{notification.time}</p>

                    </div>
                ))
            ) : 
            <p className='italics text-black/80'>there are no notifications</p>

            }
      
    </div>
  )
}

export default BiggerNotification

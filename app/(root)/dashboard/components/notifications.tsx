import Image from 'next/image'
import React from 'react'

const Notifications = () => {

    const notifications = [
        "this is a dummy notification"
    ]

  return (
    <>
        {notifications.length > 0 &&(
            notifications.map((notification, index)=>(
                <div key={index} className='group relative w-full bg-[#F8BD00] py-2 px-5 flex justify-between items-center rounded-md flex-row overflow-hidden hover:cursor-pointer'>
                    <div className='flex gap-3 items-center'>
                        <div className='w-fit h-fit'>
                            <Image
                                src='/icons/alert.png'
                                width={20}
                                height={20}
                                alt='alert icon'
                            />

                        </div>
                        
                        <p className='font-bold'>{notification}</p>

                        
                    </div>

                    <div className='w-fit h-fit hover:cursor-pointer'>
                        <Image
                            src='/icons/close.png'
                            height={15}
                            width={15}
                            alt='close icon'
                        />

                    </div>

                    <div className='w-[10px] absolute top-0 bottom-0 left-0 group-hover:bg-black'></div>

                   
                    
                </div>
            ))
            
        )}
    
    </>
    
  )
}

export default Notifications

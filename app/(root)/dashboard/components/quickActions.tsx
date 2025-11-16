'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const QuickActions = () => {

    const router = useRouter()


    const quickactions = [
        {name: 'Create Resume', icon: '/icons/create.png',
            action: ()=>{router.push('/resumemanager')}

        },
        {name: 'Create Cover Letter', icon: '/icons/create.png',
             action: ()=>{router.push('/coverlettergenerator')}
        },
        {name: 'Interview Prep', icon: '/icons/write.png',
             action: ()=>{toast('coming soon ...')}
        },
        {name: 'Exam Prep', icon: '/icons/write.png',
             action: ()=>{toast('coming soon ...')}
        },
    ]

  return (
    

    <div className='hidden md:flex gap-7 flex-wrap'>
        {quickactions.map((action, index)=>(
            <div 
            
            
            key={index} className='p-3 flex items-center gap-2 bg-white borer border-black border-1 rounded-lg shadow hover:cursor-pointer'>
                <div className='w-fit h-fit hover:cursor-pointer' 
                    onClick={action.action}
                >
                    <Image
                        className=''
                        src={action.icon}
                        alt={`${action.name} icon`}
                        width={20}
                        height={20}

                    />
                </div>
                <p>{action.name}</p>

            </div>
        ))}
      
    </div>
  )
}

export default QuickActions

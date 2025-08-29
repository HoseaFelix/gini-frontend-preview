
import Image from 'next/image'
import React from 'react'

const QuickActions = () => {

    


    const quickactions = [
        {name: 'Create Resume', icon: '/icons/create.png'},
        {name: 'Create Cover Letter', icon: '/icons/create.png'},
        {name: 'Interview Prep', icon: '/icons/write.png'},
        {name: 'Exam Prep', icon: '/icons/write.png'},
    ]

  return (
    

    <div className='hidden md:flex gap-7 flex-wrap'>
        {quickactions.map((action, index)=>(
            <div 
            
            
            key={index} className='p-3 flex items-center gap-2 bg-white borer border-black border-1 rounded-lg shadow hover:cursor-pointer'>
                <div className='w-fit h-fit'>
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

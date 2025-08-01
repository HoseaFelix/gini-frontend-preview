import React from 'react'

const Savedresume = () => {

    const SavedResume = [
        {
           
            title: 'sales Assistant',
            id: 1,
        },
        {
           
            title: 'sales Assistant',
            id: 2,
        },
        {
            
            title: 'sales Assistant',
            id: 3,
        },
    ]

  return (
    <div className='w-full h-fit p-5 rounded-lg bg-white shadow-sm flex flex-col gap-5'>
        <p className='font-bold text-xl'>Saved Resume</p>
        <div className='flex flex-col gap-3'>
            {SavedResume.length > 0 && (
                SavedResume.map((resume, index)=>(
                    <div key={index} className='flex justify-between items-center text-text font-bold opacity-80 border border-text/50 rounded-sm px-4 py-3 hover:border-blue-400'>
                        
                        <p>{resume.title}</p>
                        <div className='flex gap-3'>
                            <p className='hover:cursor-pointer'>View</p>
                            <p className='hover:cursor-pointer'>Delete</p>
                            <p className='hover:cursor-pointer'>Export</p>

                        </div>

                    </div>
                ))
            )}

        </div>
      
    </div>
  )
}

export default Savedresume

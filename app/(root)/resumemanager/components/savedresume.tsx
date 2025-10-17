'use client'

import { getSavedResume, handleDeleteResume } from '@/lib/constants/constants'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Savedresume = () => {

  const router = useRouter()
  const [SavedResume, setSavedResume] = useState<any[]>([])
  const [deleted, setDeleted]= useState(0)
  
    useEffect(() => {

      const fetchData = async () => {
        await getSavedResume();
        const stored = localStorage.getItem('savedResume')
        if (stored) {
          setSavedResume(JSON.parse(stored))
        }
      };
      
      fetchData()

      const stored = localStorage.getItem('savedResume')
      if (stored) {
        setSavedResume(JSON.parse(stored))
      }
    }, [deleted])

    const handleView = (index)=>{
      localStorage.setItem('type',JSON.stringify({
        type: 'old',
        index: index
      }))

      router.push('resumemanager/templates1')

    }

    const handleDelete = async (id)=>{
      const data = await handleDeleteResume(id)
      if(data.success){
        setDeleted(prev=>prev+1)
      }


    }


  return (
    <div className='w-full h-fit p-5 rounded-lg bg-white shadow-sm flex flex-col gap-5'>
        <p className='font-bold text-xl'>Saved Resume</p>
        <div className='flex flex-col gap-3'>
            {SavedResume.length > 0 && (
                SavedResume.map((resume, index)=>(
                    <div key={index} className='flex justify-between items-center text-text font-bold opacity-80 border border-text/50 rounded-sm px-4 py-3 hover:border-blue-400'>
                        
                        <p>{resume.file_name}</p>
                        <div className='flex gap-3'>
                            <p onClick={()=>handleView(index)} className='hover:cursor-pointer'>View</p>
                            <p onClick={()=>handleDelete(resume.id)} className='hover:cursor-pointer'>Delete</p>
                        </div>

                    </div>
                ))
            )}

        </div>
      
    </div>
  )
}

export default Savedresume

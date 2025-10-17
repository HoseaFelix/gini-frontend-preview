import { getSavedCoverLetter, handleDeleteCoverLetter } from '@/lib/constants/constants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SavedLetters = () => {

    const [savedLetters, setSavedletters] = useState([])
    const [deleted, setDeleted]= useState(0)

    const router = useRouter()

       useEffect(() => {
    
          const fetchData = async () => {
            await getSavedCoverLetter();
            const stored = localStorage.getItem('savedCoverLetters')
            if (stored) {
              setSavedletters(JSON.parse(stored))
            }
          };
          
          fetchData()
    
        }, [deleted])



            const handleView = (index)=>{
              localStorage.setItem('typeCoverLetter',JSON.stringify({
                type: 'old',
                index: index
              }))
        
              router.push('coverlettergenerator/covertemplate1')
        
            }
        
            const handleDelete = async (id)=>{
              const data = await handleDeleteCoverLetter(id)

              if(data.success){
                setDeleted(prev=>prev+1)
              }
        
        
            }
  return (
    <div className='w-full h-fit p-5 rounded-lg bg-white shadow-sm flex flex-col gap-5'>
        <p className='font-bold text-xl'>Saved Cover Letters</p>
        <div className='flex flex-col gap-3'>
            {savedLetters.length > 0 && (
                savedLetters.map((resume, index)=>(
                    <div key={index} className='flex justify-between items-center text-text font-bold opacity-80 border border-text/50 rounded-sm px-4 py-3 hover:border-blue-400'>
                        
                        <p>{resume.title}</p>
                        <div className='flex gap-3'>
                            <p className='hover:cursor-pointer' onClick={()=>{handleView(index)}}>View</p>
                            <p className='hover:cursor-pointer' onClick={()=>{handleDelete(resume.id)}}>Delete</p>

                        </div>

                    </div>
                ))
            )}

        </div>
      
    </div>
  )
}

export default SavedLetters

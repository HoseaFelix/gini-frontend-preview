'use client'

import { CoverLetter, ResumeType } from '@/lib/schemes/resumeSchema'
import React, { useEffect, useState } from 'react'
// import FormatButtons from '../../resumemanager/components/formatButtons'

const Page = () => {

    const [coverLetter, setCoverletter] = useState<CoverLetter | null>(null)
    const [resume, setResume] = useState<ResumeType | null>(null)

    useEffect(()=>{
        const CoverLetter = JSON.parse(localStorage.getItem('coverLetter'))
        const Resume = JSON.parse(localStorage.getItem('resume'))
        if(CoverLetter)
        setCoverletter(CoverLetter)

        if(Resume) setResume(Resume)
    },[])

    function getFullDate(date = new Date()) {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }



    if(coverLetter == null) return <p>No cover letter selected</p>

  return (

    <section className='w-full h-full px-4 py-10 relative'>
        <main className='w-full max-w-[794px] h-max mx-auto bg-white overflow-hidden rounded-lg shadow-lg print:w-[794px] flex flex-col pb-10'>
        <div className='w-full flex flex-col relative '>
            <div className='w-full flex items-center h-[200px] bg-text/40'>
                <div className='flex flex-col gap-3 h-max pl-5'>
                    <p className='text-3xl font-bold'>{resume.name}</p>
                    <p>{resume.contactInfo.email}</p>
                    <p>{resume.headline}</p>

                </div>

                

            </div>

            <div className='w-full pt-10 px-5 flex flex-col'>
                    <p className='font-bold capitalize text-2xl mx-auto'>job appliation letter</p>

                    <div className='mt-5 font-bold'>
                        {getFullDate()}
                    </div>



                    <p className='mt-5 font-bold'>Dear <span className='bold'>{coverLetter.hiringManagerName}</span> </p>

                    <div className='w-full gap-5 flex flex-col mt-5'>
                        {coverLetter.letter.map((p, i)=>(
                            <p key={i}>{p}</p>
                        ))}

                    </div>

            </div>

        </div>

    </main>

    </section>
    
  )
}

export default Page

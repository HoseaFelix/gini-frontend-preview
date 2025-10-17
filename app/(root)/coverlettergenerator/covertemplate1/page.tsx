'use client'

import React, { useEffect, useState } from 'react'
import { CoverLetter, ResumeType } from '@/lib/schemes/resumeSchema'
import FormatButtons from '../../resumemanager/components/formatButtons';
import TitleOverlay from '@/components/TitleOverlay';
import { toast } from 'sonner';
import { handleSaveCoverletter } from '@/lib/constants/constants';

/**
 * Small helpers
 */
const preventEnterBlur = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).blur()
  }
}



const setByPath = (obj: any, path: Array<string | number>, value: any) => {
  const next: any = JSON.parse(JSON.stringify(obj))
  let curr: any = next
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (typeof key === 'number') {
      if (!Array.isArray(curr)) return next
      curr = curr[key]
    } else {
      if (!(key in curr)) curr[key] = {}
      curr = curr[key]
    }
  }
  const last = path[path.length - 1]
  curr[last as any] = value
  return next
}

const Page = () => {
  const [coverLetter, setCoverletter] = useState<CoverLetter | null>(null)
  const [resume, setResume] = useState<ResumeType | null>(null)
  const [title,setTitle] = useState('')
  const [isVisible, setVisibility]= useState(false)

  useEffect(() => {

    const type = JSON.parse(localStorage.getItem('typeCoverLetter'))

    
    if (type.type == 'old'){
       const stored = localStorage.getItem('savedCoverLetters')
       console.log(JSON.parse(stored)[type.index])
            if (stored) {
              setCoverletter(JSON.parse(stored)[type.index].data)
            }
    } else{
    try {
      const storedCover = localStorage.getItem('coverLetter')
      const storedResume = localStorage.getItem('selectedResume')
      console.log(storedResume)
      if (storedCover) setCoverletter(JSON.parse(storedCover))
      if (storedResume) setResume(JSON.parse(storedResume))
        if(storedCover && storedResume){
          const resume = JSON.parse(storedResume)
          const cover = JSON.parse(storedCover)
          const newCover = {
            hiringManagerName: cover?.hiringManagerName || '',
            name: resume?.name || 'Your name here',
            email: resume?.contactInfo?.email || 'example@gmail.com',
            headline: resume?.headline || 'your resume headline',
            letter: cover?.letter || '',
          }

          console.log(newCover)
          setCoverletter(newCover)
        }
    } catch (err) {
      console.warn('Failed to parse localStorage for coverLetter/resume', err)
    }
    }

  }, [])

  const collectTitle = (e)=>{
    setTitle(e.target.value)
  }

  const handleVisibility = ()=> {
    setVisibility(prev => !prev)
  }

  const handleSave = async ()=>{
    if(!title){
      toast('please enter a title')
    }
    const payload = {
      title: title,
      data: coverLetter

    }

    const data = await handleSaveCoverletter(payload)
    if(data.success){
      setVisibility(false)
    }
  }
  // Persist helpers
  const persistCover = (next: CoverLetter | null) => {
    setCoverletter(next)
    try {
      if (next) localStorage.setItem('coverLetter', JSON.stringify(next))
      else localStorage.removeItem('coverLetter')
    } catch (err) {
      console.warn('Could not save coverLetter', err)
    }
  }

  const persistResume = (next: ResumeType | null) => {
    setResume(next)
    try {
      if (next) localStorage.setItem('resume', JSON.stringify(next))
      else localStorage.removeItem('resume')
    } catch (err) {
      console.warn('Could not save resume', err)
    }
  }

  // Generic field blur for resume
  const handleResumeFieldBlur = (path: Array<string | number>) => (
    e: React.FocusEvent<HTMLElement>
  ) => {
    const text = (e.currentTarget as HTMLElement).innerText ?? ''
    const trimmed = text.trim()
    if (!resume) return
    const next = setByPath(resume, path, trimmed)
    persistResume(next)
  }

  // Generic field blur for cover letter
  const handleCoverFieldBlur = (path: Array<string | number>) => (
    e: React.FocusEvent<HTMLElement>
  ) => {
    const text = (e.currentTarget as HTMLElement).innerText ?? ''
    const trimmed = text.trim()
    if (!coverLetter) return

    // Special handling for editing a paragraph inside coverLetter.letter (array)
    if (path.length === 2 && path[0] === 'letter' && typeof path[1] === 'number') {
      const idx = path[1] as number
      const next: any = JSON.parse(JSON.stringify(coverLetter))
      const arr = Array.isArray(next.letter) ? next.letter.slice() : []
      if (trimmed === '') {
        // remove paragraph when cleared
        arr.splice(idx, 1)
      } else {
        arr[idx] = trimmed
      }
      next.letter = arr
      persistCover(next)
      return
    }

    const next = setByPath(coverLetter, path, trimmed)
    persistCover(next)
  }

  const addParagraph = () => {
    if (!coverLetter) return
    const next: any = JSON.parse(JSON.stringify(coverLetter))
    next.letter = next.letter || []
    next.letter.push('')
    persistCover(next)
    // Note: the new paragraph will be empty and editable — user can type and blur to save
  }

  function getFullDate(date = new Date()) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleExport = ()=>{
    window.print()
  }

  if (coverLetter == null) return <p>No cover letter selected</p>

  return (
    <section className="w-full h-full px-4 py-10 relative flex justify-center items-center flex-col print:py-0 print:px-0 ">

      <TitleOverlay isVisible={isVisible} collectTitle={collectTitle} setVisiblity={setVisibility} handleSave={handleSave}/>
    <FormatButtons/>
     <div className=" print:hidden absolute top-4 right-4 flex flex-wrap gap-2 mb-5">
        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base"
        >
          Export
        </button>
        <button
          onClick={handleVisibility}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base"
        >
          Save
        </button>
      </div>

      <main className="mt-10 print:mt-0 w-full max-w-[794px] h-max mx-auto bg-white overflow-hidden rounded-lg shadow-lg print:w-[794px] flex flex-col pb-10 relative print:mx-auto ">
       
        <div className="w-full flex flex-col relative ">
        <style>{`@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;  } }`}</style>
          <div className="w-full flex items-center h-[200px]" style={{ backgroundColor: 'rgba(156,163,175,0.5)', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} >
            <div className="flex flex-col gap-3 h-max pl-5">
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={handleResumeFieldBlur(['name'])}
                onKeyDown={preventEnterBlur}
                className="text-3xl font-bold"
              >
                {coverLetter?.name ?? 'Your name here'}
              </p>

              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={handleResumeFieldBlur(['contactInfo', 'email'])}
                onKeyDown={preventEnterBlur}
              >
                {coverLetter?.email ?? 'you@example.com'}
              </p>

              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={handleResumeFieldBlur(['headline'])}
                onKeyDown={preventEnterBlur}
              >
                {coverLetter?.headline ?? 'Professional headline'}
              </p>
            </div>
          </div>

          <div className="w-full pt-10 px-5 flex flex-col">
            <p className="font-bold capitalize text-2xl mx-auto">job application letter</p>

            <div className="mt-5 font-bold">{getFullDate()}</div>

            <p className="mt-5 font-bold">
              Dear{' '}
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={handleCoverFieldBlur(['hiringManagerName'])}
                onKeyDown={preventEnterBlur}
              >
                {coverLetter.hiringManagerName || 'Hiring Manager'}
              </span>{' '}
            </p>

            <div className="w-full gap-5 flex flex-col mt-5">
              {Array.isArray(coverLetter.letter) && coverLetter.letter.length > 0 ? (
                coverLetter.letter.map((p, i) => (
                  <p
                    key={i}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleCoverFieldBlur(['letter', i])}
                    onKeyDown={preventEnterBlur}
                  >
                    {p}
                  </p>
                ))
              ) : (
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleCoverFieldBlur(['letter', 0])}
                  onKeyDown={preventEnterBlur}
                >
                  {''}
                </p>
              )}

              <div className="flex gap-2 print:hidden">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={addParagraph}
                >
                  + Add paragraph
                </button>

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    // quick save to localStorage (already saved on blur, but useful)
                    try {
                      localStorage.setItem('coverLetter', JSON.stringify(coverLetter))
                      if (resume) localStorage.setItem('resume', JSON.stringify(resume))
                    } catch (err) {
                      console.warn('Could not save', err)
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  )
}

export default Page

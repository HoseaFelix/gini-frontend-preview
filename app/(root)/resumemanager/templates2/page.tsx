'use client'

import { useOptimizedStore,  } from '@/store/resumeStore'
import React, { useEffect, useRef, useState } from 'react'
import { ResumeType } from '@/lib/schemes/resumeSchema'
import { useAuthStore, useCurrentNav } from '@/store/store'
import FormatButtons from '../components/formatButtons'
import TitleOverlay from '@/components/TitleOverlay'
import { toast } from 'sonner'
// import Savedresume from '../components/savedresume'

/**
 * Helper: split paragraph into sentence-like pieces (keeps punctuation)
 */
const splitSentences = (text: string) =>
  (text?.match(/[^.!?]+(?:[.!?](?=\s|$))?/g) || [])
    .map((s) => s.trim())
    .filter(Boolean);


/**
 * Helper: join sentence pieces back into a single string (each ends with punctuation)
 */
const joinSentences = (arr: string[]) =>
  arr
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map((s) =>
      /[.?!]$/.test(s) ? s : `${s}.`
    )
    .join(' ')

const preventEnterBlur = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key === 'Enter') {
    // e.preventDefault()
    // ;(e.currentTarget as HTMLElement).blur()
  }
}

const Template1Page = () => {
  const [resume, setResume] = useState<ResumeType | null>(null)
  const resumeRef = useRef<HTMLDivElement | null>(null)
  const [title, setTitle] = useState('')
  const [isVisible, setIsvisible] = useState(false)


  const collectTitle = (e)=>{
    setTitle(e.target.value)
  }

  const setVisiblity = ()=>{
    setIsvisible((prev)=> !prev)
  }

 useEffect(() => {

    const type =JSON.parse( localStorage.getItem('type'))
    console.log(type)

    if(type.type == 'new'){

    const localResume = localStorage.getItem('resume')
    const localOriginalResume = localStorage.getItem('originalResume')

    const parsed = localResume
      ? JSON.parse(localResume)
      : useOptimizedStore.getState().parsedResume

    const originaResume = JSON.parse(localOriginalResume)
    

    try{
      if(originaResume && parsed){
            const formatedResume = {
                  name: originaResume.name,
                  headline:parsed.headline,
                  contactInfo: originaResume.contactInfo,
                  education: parsed.education,
                  skills: parsed.skills,
                  awards: parsed.awards,
                  careerObjective: parsed.careerObjective,
                  experience: parsed.experience,
                  projects: parsed.projects

            }

          setResume(formatedResume)
          localStorage.setItem('resume', JSON.stringify(formatedResume))
          console.log(formatedResume)
          
      }else if (parsed) {
          setResume(parsed)
          localStorage.setItem('resume', JSON.stringify(parsed))
        }
      } finally {
        localStorage.removeItem('originalResume')
      }
    } else{
      const savedResume = JSON.parse(localStorage.getItem('savedResume'))
      setResume(savedResume[type.index].data)
      console.log(savedResume[type.index].data)
    }
   

    useCurrentNav.getState().setCurrentNav('Resume Manager')
  }, [])

  // persist updates safely and immutably
  const updateAndPersist = (updater: (prev: ResumeType) => ResumeType) => {
    setResume((prev) => {
      if (!prev) return prev
      const next = updater(JSON.parse(JSON.stringify(prev)))
      try {
        localStorage.setItem('resume', JSON.stringify(next))
      } catch (err) {
        console.warn('Could not save resume to localStorage', err)
      }
      return next
    })
  }

  // Generic set-by-path helper (path elements are strings or numbers)
  const setByPath = (prev: ResumeType, path: Array<string | number>, value: any) => {
    const next: any = JSON.parse(JSON.stringify(prev))
    let curr: any = next
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      if (typeof key === 'number') {
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

  // Generic blur handler for most fields
  const handleFieldBlur =
    (path: Array<string | number>) => (e: React.FocusEvent<HTMLElement>) => {
      const text = (e.currentTarget as HTMLElement).innerText ?? ''
      updateAndPersist((prev) => setByPath(prev, path, text))
    }

  // Handler for editing an ITEM inside skills/awards/etc. (path points to array, last element is index)
 // Generic array item blur -> remove empty items instead of saving empty strings
const handleArrayItemBlur =
  (pathToArray: Array<string | number>, index: number) =>
  (e: React.FocusEvent<HTMLElement>) => {
    const text = (e.currentTarget as HTMLElement).innerText ?? ''
    const trimmed = text.trim()

    updateAndPersist((prev) => {
      const next: any = JSON.parse(JSON.stringify(prev))
      // traverse to array
      let curr: any = next
      for (let i = 0; i < pathToArray.length; i++) {
        curr = curr[pathToArray[i] as any]
      }
      if (!Array.isArray(curr)) return next

      if (trimmed === '') {
        // remove the item entirely
        curr.splice(index, 1)
      } else {
        // save trimmed value
        curr[index] = trimmed
      }

      return next
    })
  }


  // Experience: edit specific achievement sentence
// Experience achievements: remove an achievement sentence when cleared
const handleExperienceAchievementBlur =
  (expIndex: number, achIndex: number) => (e: React.FocusEvent<HTMLElement>) => {
    const text = (e.currentTarget as HTMLElement).innerText.trim().replace(/\s+$/g, '')

    updateAndPersist((prev) => {
      const next: any = JSON.parse(JSON.stringify(prev))
      const exp = next.experience[expIndex]
      const arr = splitSentences(exp.achievements) // array of sentences

      if (text === '') {
        // remove empty sentence
        arr.splice(achIndex, 1)
      } else {
        arr[achIndex] = text
      }

      exp.achievements = joinSentences(arr)
      return next
    })
  }


  // Projects: edit specific achievement sentence
 // Project achievements: same logic as experience
const handleProjectAchievementBlur =
  (projIndex: number, achIndex: number) => (e: React.FocusEvent<HTMLElement>) => {
    const text = (e.currentTarget as HTMLElement).innerText.trim().replace(/\s+$/g, '')

    updateAndPersist((prev) => {
      const next: any = JSON.parse(JSON.stringify(prev))
      const proj = next.projects[projIndex]
      const arr = splitSentences(proj.achievements)

      if (text === '') {
        arr.splice(achIndex, 1)
      } else {
        arr[achIndex] = text
      }

      proj.achievements = joinSentences(arr)
      return next
    })
  }



  const handleExport = async () => {
    window.print()
  }

  const handleSave = async ()=>{
    if(!title){
        toast.error('please enter title')
        return;
      }
      const token = useAuthStore.getState().token;

    try{
      toast('uploading resume to cloud')

      
        const payload = {
          file_id:'jlsj;j;ljsaljsjhfjshfkjsh',
          file_name: title,
          data: {
            name:'francis',
            phonenumber:'090909080'
          },
        }
        

      const res = await fetch("https://aidgeny.onrender.com/api/documents/json", {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",

        },


        body: JSON.stringify(payload),


      })

      

      const data = await res.json()
      console.log(data)
      if(data.success){
        toast.success('resume saved successfully!')
      } else {
        toast.error(data.error)
        return
      }

    } catch (e){
      console.error(e)
      toast.error(e.message)
    }


    // const resumeArray = JSON.parse(localStorage.getItem('savedResume')) || []

  
    // resumeArray.push({
    //   name: title,
    //   resume: resume
    // })

    // console.log(resumeArray)
    // localStorage.setItem( 'savedResume', JSON.stringify(resumeArray))
    // toast.success('resume saved')
    setTitle('')
    setVisiblity()
  }

    if (!resume) {
    return (
      <section className="w-full h-screen flex items-center justify-center bg-gray-100 relative">
        <p className="text-lg text-gray-500">No resume data found.</p>
      </section>
    )
  }

  const contactItems = [
  resume.contactInfo.phone,
  resume.contactInfo.email,
  resume.contactInfo.address,
  resume.contactInfo.linkedIn,
];

  // const isValid = (val: unknown) =>
  //   val !== undefined && val !== null && val !== 'undefined' && `${val}`.trim() !== ''

  return (
    <section className="w-full pb-10 min-h-screen bg-gray-100 px-2 sm:px-4 pt-14 flex flex-col gap-5 justify-center relative">

      <TitleOverlay isVisible={isVisible} collectTitle={collectTitle} setVisiblity={setVisiblity} handleSave={handleSave}/>
     
      <FormatButtons />
      <div className=" print:hidden absolute top-4 right-4 flex flex-wrap gap-2 mb-5">
        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base"
        >
          Export
        </button>
        <button
          onClick={setVisiblity}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base"
        >
          Save
        </button>
      </div>

      <div
        ref={resumeRef}
        id="resume-div"
        className="bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-text/70 w-full sm:max-w-[900px] print:max-w-[900px] mx-auto"
      >
        {/* Top section */}
        <div className="flex flex-col flex-wrap gap-4 sm:gap-5 justify-between border-b pb-4 print:flex-row print:gap-5">
          <div className=" ">
            {/* Name */}
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleFieldBlur(['name'])}
              onKeyDown={preventEnterBlur}
              className="font-bold print:text-xl text-3xl sm:text-6xl"
            >
              {resume.name}
            </p>

            {/* Headline */}
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleFieldBlur(['headline'])}
              onKeyDown={preventEnterBlur}
              className="text-text/80 text-base sm:text-lg"
            >
              {resume.headline}
            </p>
          </div>

            <div className="flex text-text/70 gap-1 text-sm sm:text-base flex-wrap">
                {contactItems
                    .filter(Boolean) // remove empty or undefined fields
                    .map((item, index, arr) => (
                    <React.Fragment key={index}>
                        <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleFieldBlur(['contactInfo', Object.keys(resume.contactInfo)[index]])}
                        onKeyDown={preventEnterBlur}
                        >
                        {item}
                        </p>

                        {/* Only show dot if not the last visible item */}
                        {index < arr.length - 1 && (
                        <div className="flex items-center justify-center h-6">
                            <p className="font-bold text-2xl leading-none">·</p>
                        </div>
                        )}
                    </React.Fragment>
                    ))}
            </div>

        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-5 mt-6 print:flex-row print:gap-5">

          {/* Right column */}
          <div className="flex flex-col gap-5 flex-1">
            {/* Career Objective */}
            <div className="flex flex-col gap-3">
              <p className="font-bold text-xl">PROFESSIONAL SUMMARY</p>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={handleFieldBlur(['careerObjective'])}
                onKeyDown={preventEnterBlur}
                className="text-sm sm:text-base"
              >
                {resume.careerObjective}
              </p>
            </div>

            {/* SKILLS */}
            <div className="flex flex-col gap-4 template2-skill-section border-t border-black/80 mt-5">
              <p className="font-bold text-xl mt-3">SKILLS</p>

              {/* Technical */}
              {resume.skills?.technical && (
                <div>
                  <p className="font-bold mb-5">Technical Skills</p>
                  <div className="pl-5">
                    {/* Languages */}
                    {resume.skills?.technical?.languages?.length ? (
                      <>
                        <p className="font-bold mt-2">Languages</p>
                        <ul className=" pl-5 text-sm sm:text-base">
                          {resume.skills.technical.languages.map((lang, i) => (
                            <li
                              key={i}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={handleArrayItemBlur(['skills', 'technical', 'languages'], i)}
                              onKeyDown={preventEnterBlur}
                            >
                              {lang}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {/* Frameworks */}
                    {resume.skills?.technical?.frameworksAndLibraries?.length ? (
                      <>
                        <p className="font-bold mt-3">Frameworks & Libraries</p>
                        <ul className=" pl-5 text-sm sm:text-base">
                          {resume.skills.technical.frameworksAndLibraries.map((fw, i) => (
                            <li
                              key={i}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={handleArrayItemBlur(['skills', 'technical', 'frameworksAndLibraries'], i)}
                              onKeyDown={preventEnterBlur}
                            >
                              {fw}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {/* Tools */}
                    {resume.skills?.technical?.toolsAndBuildSystems?.length ? (
                      <>
                        <p className="font-bold mt-2">Tools & Build Systems</p>
                        <ul className=" pl-5 text-sm sm:text-base">
                          {resume.skills.technical.toolsAndBuildSystems.map((tool, i) => (
                            <li
                              key={i}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={handleArrayItemBlur(['skills', 'technical', 'toolsAndBuildSystems'], i)}
                              onKeyDown={preventEnterBlur}
                            >
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {/* Testing */}
                    {resume.skills?.technical?.testing?.length ? (
                      <>
                        <p className="font-bold mt-2">Testing</p>
                        <ul className=" pl-5 text-sm sm:text-base">
                          {resume.skills.technical.testing.map((test, i) => (
                            <li
                              key={i}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={handleArrayItemBlur(['skills', 'technical', 'testing'], i)}
                              onKeyDown={preventEnterBlur}
                            >
                              {test}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {/* Practices */}
                    {resume.skills?.technical?.practices?.length ? (
                      <>
                        <p className="font-bold mt-2">Practices</p>
                        <ul className=" pl-5 text-sm sm:text-base">
                          {resume.skills.technical.practices.map((practice, i) => (
                            <li
                              key={i}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={handleArrayItemBlur(['skills', 'technical', 'practices'], i)}
                              onKeyDown={preventEnterBlur}
                            >
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {resume.skills?.soft?.length ? (
                <div>
                  <p className="font-semibold">Soft Skills</p>
                  <ul className=" pl-5 text-sm sm:text-base">
                    {resume.skills.soft.map((skill, i) => (
                      <li
                        key={i}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleArrayItemBlur(['skills', 'soft'], i)}
                        onKeyDown={preventEnterBlur}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Certifications */}
              {resume.skills?.certifications?.length ? (
                <div>
                  <p className="font-semibold">Certifications</p>
                  <ul className=" pl-5 text-sm sm:text-base">
                    {resume.skills.certifications.map((cert, i) => (
                      <li
                        key={i}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleArrayItemBlur(['skills', 'certifications'], i)}
                        onKeyDown={preventEnterBlur}
                      >
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            

            {/* Experience */}
            <div className="flex flex-col gap-3 border-t-1 border-black/80 mt-5">
              <p className="font-bold text-xl mt-3">EXPERIENCE</p>
              {resume.experience?.map((exp, index) => {
                const achArr = splitSentences(exp.achievements)
                return (
                  <div key={index} className="space-y-2 text-sm sm:text-base">
                    <p className="font-bold">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleFieldBlur(['experience', index, 'heading'])}
                        onKeyDown={preventEnterBlur}
                      >
                        {exp.heading}
                      </span>{' '}
                      |{' '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleFieldBlur(['experience', index, 'duration'])}
                        onKeyDown={preventEnterBlur}
                      >
                        {exp.duration}
                      </span>
                    </p>
                    <ul className="space-y-2  pl-5">
                      {achArr.map((ach: string, j: number) => (
                        <li
                          key={`${index}-${j}`}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleExperienceAchievementBlur(index, j)}
                          onKeyDown={preventEnterBlur}
                        >
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="flex flex-col gap-3 border-t-1 border-black/80 mt-5">
                <p className="font-bold text-xl">PROJECTS</p>
                {resume.projects.map((proj, index) => {
                  const achArr = splitSentences(proj.achievements)
                  return (
                    <div key={index} className="space-y-2 text-sm sm:text-base">
                      <p className="font-medium">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['projects', index, 'name'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {proj.name}
                        </span>{' '}
                        |{' '}
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['projects', index, 'duration'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {proj.duration}
                        </span>
                      </p>
                      <ul className=" space-y-2 pl-5">
                        {achArr.map((ach: string, j: number) => (
                          <li
                            key={`${index}-${j}`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={handleProjectAchievementBlur(index, j)}
                            onKeyDown={preventEnterBlur}
                          >
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}

            {/* EDUCATION */}
             <div className="flex flex-col gap-3 border-t-1 border-black/80 mt-5">
              <p className="font-bold text-xl mt-3">EDUCATION</p>
              {resume.education?.map((edu, index) => (
                <div key={index} className="flex flex-col gap-1 text-sm sm:text-base">
                  <p>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleFieldBlur(['education', index, 'startYear'])}
                      onKeyDown={preventEnterBlur}
                      className={`${edu.startYear === 'undefined' ? 'hidden' : ''}`}
                    >
                      {edu.startYear}
                    </span>
                    <span className={`${edu.endYear === 'undefined' ? 'hidden' : ''}`}>
                      {edu.endYear !== 'undefined' ? ` - ` : ''}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleFieldBlur(['education', index, 'endYear'])}
                        onKeyDown={preventEnterBlur}
                      >
                        {edu.endYear}
                      </span>
                    </span>
                  </p>

                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleFieldBlur(['education', index, 'institution'])}
                    onKeyDown={preventEnterBlur}
                  >
                    {edu.institution}
                  </p>

                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleFieldBlur(['education', index, 'degree'])}
                    onKeyDown={preventEnterBlur}
                  >
                    {edu.degree}
                  </p>
                </div>
              ))}
            </div>

             {/* Awards */}
            {resume.awards && resume.awards.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-bold text-xl">AWARDS</p>
                <ul className=" pl-5 text-sm sm:text-base">
                  {resume.awards.map((award, index) => (
                    <li
                      key={index}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleArrayItemBlur(['awards'], index)}
                      onKeyDown={preventEnterBlur}
                    >
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Template1Page

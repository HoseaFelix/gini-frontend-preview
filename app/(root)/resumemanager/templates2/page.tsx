'use client'

import { useOptimizedStore,  } from '@/store/resumeStore'
import React, { useEffect, useRef, useState } from 'react'
import { ResumeType } from '@/lib/schemes/resumeSchema'
import { useAuthStore, useCurrentNav } from '@/store/store'
import FormatButtons from '../components/formatButtons'
import TitleOverlay from '@/components/TitleOverlay'
import { toast } from 'sonner'
import htmlDocx from "html-docx-js/dist/html-docx";
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
      const fetchData = async () => {
              const savedResume = JSON.parse(localStorage.getItem('savedResume'))
              if (savedResume) {
                setResume(savedResume)
                console.log(savedResume)
              }
            };
            
            fetchData()
      
      
      
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



  const handleExport = async (type) => {
    if(type == 'PDF'){
      window.print()
    } else{
        const content = document.querySelector('.resume-container') as HTMLElement | null;

        if (!content) {
          console.error('Resume container not found!');
          return;
        }

        const clone = content.cloneNode(true) as HTMLElement;

        // Convert Tailwind/computed styles into inline CSS
        const allElements = clone.querySelectorAll('*');
        allElements.forEach((el) => {
          const computed = window.getComputedStyle(el);
          (el as HTMLElement).style.cssText = computed.cssText; // safely cast
        });

        // Wrap in HTML and convert to blob
        const html = '<!DOCTYPE html>' + clone.outerHTML;
        const converted = htmlDocx.asBlob(html);

        // Trigger download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(converted);
        a.download = 'resume.docx';
        a.click();
        toast('downloaded')


    }

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
          file_name: title,
          data: resume,
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
  resume.contactInfo.phone ?? 'phone number',
  resume.contactInfo.email ?? 'email@example.com',
  resume.contactInfo.address ?? 'your address',
  resume.contactInfo.linkedIn ?? 'linkedin profile',
];

const printable = (val: any) => {
  if (val == null) return '';
  if (Array.isArray(val)) return val.join(', ');
  // If it's an object (e.g. { js: true }) try reasonable conversions:
  if (typeof val === 'object') {
    try {
      // flatten simple object into "k: v" pairs
      const entries = Object.entries(val);
      if (entries.length) return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
};


  return (
    <section className="w-full pb-10 min-h-screen bg-gray-100 px-2 sm:px-4 pt-14 flex flex-col gap-5 justify-center relative">

      <TitleOverlay isVisible={isVisible} collectTitle={collectTitle} setVisiblity={setVisiblity} handleSave={handleSave}/>
     
      <FormatButtons />
      <div className=" print:hidden absolute top-4 right-4 flex flex-wrap gap-2 mb-5">
        <select 
          onChange={(e)=>{
            handleExport(e.target.value)
          }}
        
          name="" id="" className='border-2 border-foreground rounded-md outline outline-foreground hover:cursor-pointer'>
          <option>Export as</option>
          <option onClick={()=>{handleExport('pdf')}}>PDF</option>
          <option onClick={()=>{handleExport('pdf')}}>Docx</option>
        </select>

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
        className="resume-container bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-text/70 w-full sm:max-w-[900px] print:w-[1100px] mx-auto "
      >
        {/* Top section */}
        <div className="flex flex-col flex-wrap gap-2 justify-between border-b pb-4 print:flex-row print:gap-5">
          <div className="w-full flex flex-col ">
            {/* Name */}
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleFieldBlur(['name'])}
              onKeyDown={preventEnterBlur}
              className="font-bold print:text-xl text-2xl sm:text-6xl"
            >
              {resume.name ?? 'your name here'}
            </p>

            {/* Headline */}
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleFieldBlur(['headline'])}
              onKeyDown={preventEnterBlur}
              className="text-green-500 font-bold text-base sm:text-lg"
            >
              {resume.headline}
            </p>
          </div>

            <div className="flex  text-text/70 gap-1 text-sm sm:text-base flex-wrap w-full print:items-center">
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
              <p className="font-bold text-xl border-b-3 border-b-black">SUMMARY</p>
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
            
            
            {/*Skills*/}
            <div className="flex flex-col gap-4">
              <p className="font-bold text-xl border-b-3 border-b-black">SKILLS</p>

              {/* Technical */}
              {resume.skills?.technical && (
                <div>
                  <p className="font-bold text-green-500">Technical Skills</p>
                  <div className="pl-5">
                    {/* Languages */}
                    {resume.skills?.technical?.languages ? (
                      <p

                        className="mt-2"
                      >
                        <span className="font-bold">Languages:&nbsp;</span>
                        <span
                          className='skill-items'
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['skills', 'technical', 'languages'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {printable(resume.skills.technical.languages)}
                        </span>
                      </p>
                    ) : null}

                    {/* Frameworks & Libraries */}
                    {resume.skills?.technical?.frameworksAndLibraries ? (
                      <p

                        className="mt-2"
                      >
                        <span className="font-bold">Framework & Libraries:&nbsp;</span>
                        <span
                          className='skill-items'
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['skills', 'technical', 'frameworksAndLibraries'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {printable(resume.skills.technical.frameworksAndLibraries)}
                        </span>
                      </p>
                    ) : null}

                    {/* Tools & Build Systems */}
                    {resume.skills?.technical?.toolsAndBuildSystems ? (
                      <p

                        className="mt-2"
                      >
                        <span className="font-bold">Tools & Build systems:&nbsp;</span>
                        <span
                          className='skill-items'
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['skills', 'technical', 'toolsAndBuildSystems'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {printable(resume.skills.technical.toolsAndBuildSystems)}
                        </span>
                      </p>
                    ) : null}

                    {/* Testing */}
                    {resume.skills?.technical?.testing ? (
                      <p

                        className="mt-2"
                      >
                        <span className="font-bold">Testing:&nbsp;</span>
                        <span
                          className='skill-items'
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['skills', 'technical', 'testing'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {printable(resume.skills.technical.testing)}
                        </span>
                      </p>
                    ) : null}

                    {/* Practices */}
                    {resume.skills?.technical?.practices ? (
                      <p

                        className="mt-2"
                      >
                        <span className="font-bold">Practices:&nbsp;</span>
                        <span
                          className='skill-items'
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleFieldBlur(['skills', 'technical', 'practices'])}
                          onKeyDown={preventEnterBlur}
                        >
                          {printable(resume.skills.technical.practices)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {resume.skills?.soft ? (
                <div>
                  <p className="font-bold text-green-500">Soft Skills</p>
                  <p

                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleFieldBlur(['skills', 'soft'])}
                    onKeyDown={preventEnterBlur}
                    className="pl-5 text-sm sm:text-base skill-items"
                  >
                    {printable(resume.skills.soft)}
                  </p>
                </div>
              ) : null}

              {/* Certifications */}
              {resume.skills?.certifications.length > 0 ? (
                <div>
                  <p className="font-semibold">Certifications</p>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleFieldBlur(['skills', 'certifications'])}
                    onKeyDown={preventEnterBlur}
                    className="pl-5 text-sm sm:text-base"
                  >
                    {printable(resume.skills.certifications)}
                  </p>
                </div>
              ) : null}
            </div>
            {/* ===== END SKILLS BLOCK ===== */}

            {/* Experience */}
            <div className="flex flex-col gap-3">
              <p className="font-bold text-xl border-b-3 border-b-black">EXPERIENCE</p>
              {resume.experience?.map((exp, index) => {
                const achArr = splitSentences(exp.achievements)
                return (
                  <div key={index} className="space-y-2 text-sm sm:text-base">
                    <p className="font-bold text-green-500">
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
                    <ul className="space-y-2 list-disc pl-5">
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
              <div className="flex flex-col gap-3">
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
                      <ul className="list-disc space-y-2 pl-5">
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


            {/* Education */}
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xl border-b-3 border-b-black">EDUCATION</p>
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
                        className='font-bold'
                      >
                        {edu.endYear}
                      </span>
                    </span>
                  </p>

                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleFieldBlur(['education', index, 'institution'])}
                    onKeyDown={preventEnterBlur}
                    className='flex gap-2'
                  >
                    <p className='font-bold'>Institution :</p>
                    {edu.institution}
                  </div>

                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleFieldBlur(['education', index, 'degree'])}
                    onKeyDown={preventEnterBlur}
                    className='flex gap-2'
                  >
                    <p className='font-bold'>Qualification : </p>
                    {edu.degree}
                  </div>
                </div>
              ))}
            </div>

                        {/* Awards */}
            {resume.awards && resume.awards.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-bold text-xl">AWARDS</p>
                <ul className="list-disc pl-5 text-sm sm:text-base">
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

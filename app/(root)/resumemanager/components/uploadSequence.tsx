'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { extractTextFromFile } from '@/lib/constants/constants'
import { formatTextWithAi} from '@/lib/actions/general.actions'
import LoadingStatus from '@/components/generalComponents/loadingStatus'
import { useOptimizedStore, useResumeStore } from '@/store/resumeStore'
import { optimizeResumeWithAi } from '@/lib/actions/resumeAction'
import Amended from './amended'
import { useRouter } from 'next/navigation'
import ManualInput from './manualInput'
import { useAuthStore } from '@/store/store'
import LanguageDropdown from './LanguageDropdown'
import TemplateCarousel from '@/components/generalComponents/carouselTemplates'
// import { useResumeStore } from '@/store/resumeStore'

const UploadSequence = () => {
  const totalItems = 4
  const [currentView, setCurrentView] = useState(0)
  const [document, setDocument] = useState<File | null>(null)
  const [canContinue, setCanContinue]= useState(false)
  const [uploadingFile, setUploadingFile] = useState('waiting')
  const [analyzingDoc, setAnalyzingDoc] = useState('waiting')
  const [uploadStart, setUploadStart] = useState(false)
  const [description, setDescription] = useState('')
  const [isScanStart, setScanStart] = useState(false)
  const [isScanning, setScanning] = useState('waiting')
  const [generateImprov, setGenImprov] = useState('waiting')
  const [isFormVisible, setFormVisibility] = useState(false)
  const [language, setLanguage] = useState("English")
  const [selectedTemplate, setSelectedTemplate] = useState(false)
  const [templateIndex, setSelectedTemplateIndex] = useState<number | null>(null)

//   const [rawText, setRawText] = useState("")
const setOriginalResume = useResumeStore.getState().setParsedResume;
const setOptimizedResume = useOptimizedStore.getState().setParsedResume;
//handles uploading documents
  const handleDoc = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(!file){
        toast.error('please choose a file')
        return
    } else {
        setDocument(file)
        setCanContinue(true)
    }

  }


//handles the first continue button
  const handleFirstContinue = async ()=>{
    if(!canContinue) return;
    if(!document){
        toast.error('please choose a pdf or docx document')
        return
    } 

    
    try{
        //extracts raw text from the document using function in contants.js 

        const token = useAuthStore.getState().token;
        setUploadStart(true)
        setUploadingFile('ready')
        const rawText = await extractTextFromFile(document, token)

        //handles errors
        if(rawText == 'Unsupported file type'){
            toast.error('Unsupported file type');
            setUploadStart(false)
            return;
        } 

        // setRawText(rawText)
        setUploadingFile('done')
        setAnalyzingDoc('ready')
        
        //sends the raw text to Ai to format

        const analyzeDoc = await formatTextWithAi(rawText)

        if(analyzeDoc?.success && analyzeDoc?.parsedResume){
            setAnalyzingDoc('done')
            setUploadStart(false)
            setOriginalResume(analyzeDoc.parsedResume)
            setCurrentView((prev)=> (prev + 1) % totalItems )


        } else {
            //error handling
            console.log(analyzeDoc?.error)
            setUploadStart(false)
            setAnalyzingDoc('waiting');
            toast.error("Analysis failed please check your internet or try again later");
        }




    } catch (err: unknown) {
        setUploadingFile('waiting');
        setAnalyzingDoc('waiting');
        setUploadStart(false);
      
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
    }

   
    
    
        
  }

    const templates = [
    '/img/resumetemplate1.png',
    '/img/resumetemplate2.png',
  ]

  const handleSelect= (index)=>{
    setSelectedTemplateIndex(index)
  }

  //handles job description collection 
   const collectJobDescription = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setDescription(e.target.value)

   }

   //handles the back buttons 
   const handleBackButton = ()=>{
    setCurrentView((prev)=> prev -1)
   }


   useEffect(()=>{
     if(selectedTemplate && isScanning == 'done'){
        setCurrentView(3)
        }
   }, [selectedTemplate, isScanning])
   //handles the second continue button which sends the description along with the formatted resume to the Ai for processing  
   const handleSecondContinue = async ()=>{

    if(!description) {
        toast.error('enter description please')
        return;
    }

    setCurrentView((prev)=> prev + 1)


    try{
        setScanStart(true)
        setScanning('ready')
        const rawResume = useResumeStore.getState().parsedResume;
        console.log(rawResume)
        const optimizeResume = await optimizeResumeWithAi({description,rawResume, language })
        if(optimizeResume?.success &&optimizeResume?.parsedResume){
            setGenImprov('ready')
            setScanning('done')
            setGenImprov('done')
            setOptimizedResume(optimizeResume.parsedResume)
           
        }

    } catch(error){
        console.log(error)
        toast.error(`${error}`)
    }
    


   }

   const handleTemplateContinue= ()=>{
    if(isScanning == 'done'){
        setCurrentView((prev)=> prev + 1)
        setSelectedTemplate(true)
    }else{
        setCurrentView((prev)=> prev - 1)
        setSelectedTemplate(true)
    }
   }

   const router = useRouter()
   


   const originalResume = useResumeStore.getState().parsedResume
   const optimizedResume = useOptimizedStore.getState().parsedResume

   const handleLastContinue = ()=>{

    if(optimizedResume) {
        localStorage.setItem('resume', JSON.stringify(optimizedResume))
        localStorage.setItem('originalResume', JSON.stringify(originalResume))

        localStorage.setItem('type',JSON.stringify({
        type: 'new',
        index: ''
      }))
    }
    
    router.push(`/resumemanager/templates${templateIndex+1}`)
}

const toggleForm = ()=>{
    setFormVisibility((prev)=> !prev)
}

const handleFormContinue = async ()=>{
    setCurrentView(1)
    toggleForm()
}


  return (

    <div className='w-full h-full pt-5'>
    <div className='flex pb-6 flex-col h-full gap-5 md:h-[70dvh] w-full overflow-hidden relative'>

        {/* handles manual form input  */}
            <ManualInput isVisible={isFormVisible} onContinue={handleFormContinue} onReturn={toggleForm} />

            {/* progress bars */}
            <div className="w-full overflow-x-hidden z-20">
                <div className=' h-fit w-full px-2 sm:px-4 mx-auto flex flex-nowrap gap-1 sm:gap-2 md:gap-5'>
                    <div className='h-2 flex-1 min-w-0 rounded-lg bg-blue-500'></div>
                    <div className={`h-2 flex-1 min-w-0 rounded-lg ${currentView >= 1 ? 'bg-blue-500' : 'bg-text/60'}`}></div>
                    <div className={`h-2 flex-1 min-w-0 rounded-lg ${currentView >= 2 ? 'bg-blue-500' : 'bg-text/60'}`}></div>
                    <div className={`h-2 flex-1 min-w-0 rounded-lg ${currentView == 3 ? 'bg-blue-500' : 'bg-text/60'}`}></div>
                </div>
            </div>
            {/*slides container*/}
            <div className='w-full relative h-full  overflow-hidden pb-4 '>
                <div
                    className='grid grid-cols-4 transition-transform duration-500'
                    style={{
                    width: `${totalItems * 100}%`,
                    transform: `translateX(-${currentView * (100 / totalItems)}%)`
                    }}
                >
                    {/* Slide 1 */}
                    <div className='w-full min-w-0 h-full overflow-y-auto flex flex-col gap-10 items-center px-4 py-6'>
                        {uploadStart && (
                            <div className='flex mt-10 flex-col w-full gap-2'>
                                <div className='flex gap-5'>
                                    <LoadingStatus loading={uploadingFile}/> <p>{uploadingFile ? 'Uploading file...' : 'File uploaded'}</p>

                                </div>
                                <div className='flex gap-5'>
                                    <LoadingStatus loading={analyzingDoc}/> <p>{uploadingFile ? 'Analyzing document...' : 'Document analyzed'}</p>

                                </div>

                            </div>
                        )}
                        {!uploadStart && (
                            <>
                            
                            <div className='flex flex-col overflow-y-auto md:flex-row gap-5 sm:gap-10 mt-10 sm:mt-16'>
                            <div className='relative min-w-0'>
                                <input
                                id="fileUpload"
                                type="file"
                                className='hidden'
                                onChange={handleDoc}
                                />
                                <label htmlFor="fileUpload" className='w-full'>
                                    <div className='w-full h-fit py-5 md:w-[250px] md:h-[250px] max-sm:max-w-[85%] border rounded-lg border-text/50 flex items-center justify-center hover:cursor-pointer flex-col gap-5 pt-7 px-4'>
                                        {document && (
                                            <div className='mx-auto max-w-[90%] flex flex-wrap'>
                                                {document.name}
                                            </div>
                                        )}

                                        {!document && (
                                            <>
                                             <div className='flex items-center justify-center p-2 rounded bg-text/30'>
                                                    <Image
                                                    src={"/icons/create.png"}
                                                    width={20}
                                                    height={20}
                                                    alt='create icon'
                                                    />
                                                </div>
                                                <p>Upload from local storage</p>
                                            </>
                                            
                                        )}
                                   
                                    
                                    </div>
                                </label>
                                
                                
                            
                           
                            </div>

                            <div 
                            onClick={toggleForm}
                            className='w-fit px-10 h-fit py-5 md:w-[250px] md:h-[250px] border rounded-lg border-text/50 items-center justify-center hover:cursor-pointer flex flex-col gap-5 pt-7'>
                            <div className='flex flex-col items-center justify-center p-2 rounded bg-text/30'>
                                <Image
                                src={"/icons/write.png"}
                                width={20}
                                height={20}
                                alt='create icon'
                                />
                            </div>
                            <p>Build from a template</p>
                            </div>
                                </div>

                                <div className='w-full flex justify-center md:justify-end px-4 overflow-x-hidden '>
                                    <div className="max-w-full">
                                        <button
                                        onClick={handleFirstContinue}
                                        className={`px-4 py-2 rounded ${canContinue ? 'bg-blue-600' : 'bg-text/50'} text-white`}
                                        >
                                        Continue
                                        </button>
                                    </div>
                                </div>

                            </>
                        )}
                        
                    </div>

                    {/* Slide 2 */}
                    <div className='min-w-full flex flex-col gap-10 px-4'>

                        {isScanStart && (

                            <>
                            
                            <div className='flex mt-10 flex-col w-full gap-2'>
                                    <div className='flex gap-5'>
                                        <LoadingStatus loading={isScanning}/> <p>{isScanning !== 'done' ? 'Scanning for improvement. . . ' : 'Scanned for improvement' }</p>

                                    </div>
                                    <div className={`flex gap-5 ${generateImprov !== 'ready' ? 'opacity-10' : '' }`}>
                                        <LoadingStatus loading={generateImprov}/> <p>{generateImprov !== 'done' ?   'Generating suggestions' : 'suggestions generated'}</p>

                                    </div>

                                </div>
                            
                                <div className="space-y-4 animate-pulse w-full px-4 py-5 mt-10 border border-text/30 rounded-lg">

                                    <div className="h-10 bg-text/30 rounded w-[50%]"></div>
                                    <div className="h-6  bg-text/30  rounded w-full"></div>
                                    <div className="h-6  bg-text/30  rounded w-5/6"></div>
                                    <div className="h-6  bg-text/30  rounded w-2/3"></div>
                                    <div className="h-6  bg-text/30  rounded w-1/2"></div>
                                </div>

                               
                            </>
                               
                            )}

                            {!isScanStart && (
                                <>
                                    <div className='w-full h-max pb-5 rounded-xl mt-10 px-4 pt-5 border-1 border-black  flex flex-col gap-3 '>
                                           
                                           <LanguageDropdown setLanguage={setLanguage}/>

                                            <textarea className='border border-text/50 px-4 py-2 min-h-[200px] rounded-lg ' value={description} onChange={collectJobDescription} />

                                        </div>

                                        <div className='w-full h-fit flex items-end justify-end px-4 gap-8'>

                                                    <button 
                                                        onClick={handleBackButton}
                                                        className={`px-4 py-1.5 rounded border border-foreground bg-white text-foreground font-bold`}>
                                                        Back
                                                    </button>

                                                    <button
                                                    onClick={handleSecondContinue}
                                                    className={`px-4 py-2 rounded ${canContinue ? 'bg-blue-600' : 'bg-text/50'} text-white`}
                                                    >
                                                    Continue
                                                    </button>
                                        </div>
                                </>
                            )}

                        
                        
                    </div>

                            {/* Slide 3 */}
                    
                    <div className={`w-full h-full flex flex-col gap-5`}>
           
                        <div className={`${selectedTemplate ? 'hidden' : ''} w-full min-h-[360px] relative`}>
                        <TemplateCarousel images={templates} onSelect={handleSelect} />

                        </div>

                        <div className={`${selectedTemplate ? 'hidden' : ''} w-full h-fit flex items-end justify-end gap-3 `}>
                        <button
                            onClick={handleTemplateContinue}
                            className={`px-4 py-2 rounded ${canContinue? 'bg-blue-600': 'bg-text/50'} text-white`}
                        
                        >
                            Continue

                        </button>

                        </div>

                    </div>

                    {/* Slide 4 */}
                    <div className='w-full h-[60dvh] flex flex-col  items-center relative border border-text rounded-lg p-5 overflow-y-auto'>
                        <div className='sticky top-5 font-bold  w-full px-4 flex justify-between'>
                            <p className='text-sm md:text-xl'>Resume Optimization</p>
                            <div className='w-fit flex gap-3'>
                                <div className='text-red-600 hover:cursor-pointer md:text-xl'>Reject</div>
                                <div 
                                onClick={handleLastContinue}
                                className='text-blue-600 hover:cursor-pointer md:text-xl'>Apply</div>

                            </div>
                        </div>
                        <p className='mt-5 text-sm md:text-lg'>Your resume was analyzed based on the job description. Here&apos;s how you can optimize it for better ATS and recruiter compatibility.</p>
                        <div className='w-full gap-5 flex flex-col max-h-full md:max-h-[65dvh] overflow-y-auto'>
                            <div className='w-full h-max gap-3 md:gap-5 grid grid-cols-1 md:grid-cols-2'>
                                
                                <Amended type='current' heading='Heading' subText={`${originalResume?.headline}`}/>

                                <Amended type='suggested' heading='Heading' subText={`${optimizedResume?.headline}`}/>

                            </div>
                            <div className='w-full h-max gap-3 md:gap-5 grid grid-cols-1 md:grid-cols-2'>
                                
                                <Amended type='current' heading='Career Objective' subText={`${originalResume?.careerObjective}`}/>

                                <Amended type='suggested' heading='Career Objective' subText={`${optimizedResume?.careerObjective}`}/>

                            </div>
                            <div className='w-full h-max gap-3 md:gap-5 grid grid-cols-1 md:grid-cols-2'>
                                <div className="w-full rounded-lg flex flex-col gap-5 p-4 h-fit bg-red-300">
                                <p>Current</p>
                                <p>Skills</p>

                                <div className="space-y-4">
                                    {originalResume?.skills?.technical && (
                                    <div>
                                        <p className="font-semibold">Technical Skills</p>
                                        <ul className="list-disc space-y-2 pl-3">
                                        {originalResume?.skills?.technical?.languages?.map((skill, i) => (
                                            <li key={`lang-${i}`}>{skill}</li>
                                        ))}
                                        {originalResume?.skills?.technical?.frameworksAndLibraries?.map((skill, i) => (
                                            <li key={`fw-${i}`}>{skill}</li>
                                        ))}
                                        {originalResume?.skills?.technical?.toolsAndBuildSystems?.map((skill, i) => (
                                            <li key={`tool-${i}`}>{skill}</li>
                                        ))}
                                        {originalResume?.skills?.technical?.testing?.map((skill, i) => (
                                            <li key={`test-${i}`}>{skill}</li>
                                        ))}
                                        {originalResume?.skills?.technical?.practices?.map((skill, i) => (
                                            <li key={`practice-${i}`}>{skill}</li>
                                        ))}
                                        </ul>
                                    </div>
                                    )}

                                    {originalResume?.skills?.soft?.length ? (
                                    <div>
                                        <p className="font-semibold">Soft Skills</p>
                                        <ul className="list-disc space-y-2 pl-3">
                                        {originalResume?.skills?.soft?.map((skill, i) => (
                                            <li key={`soft-${i}`}>{skill}</li>
                                        ))}
                                        </ul>
                                    </div>
                                    ) : null}

                                    {originalResume?.skills?.certifications?.length ? (
                                    <div>
                                        <p className="font-semibold">Certifications</p>
                                        <ul className="list-disc space-y-2 pl-3">
                                        {originalResume?.skills?.certifications?.map((skill, i) => (
                                            <li key={`cert-${i}`}>{skill}</li>
                                        ))}
                                        </ul>
                                    </div>
                                    ) : null}
                                </div>
                                </div>

                                <div className="w-full rounded-lg flex flex-col gap-5 p-4 h-fit bg-green-300">
                                    <p>Suggested</p>
                                    <p>Skills</p>

                                    {/* Loop through categories */}
                                    <div className="space-y-4">
                                        {optimizedResume?.skills?.technical && (
                                        <div>
                                            <p className="font-semibold">Technical Skills</p>
                                            <ul className="list-disc space-y-2 pl-3">
                                            {optimizedResume?.skills?.technical?.languages?.map((skill, i) => (
                                                <li key={`lang-${i}`}>{skill}</li>
                                            ))}
                                            {optimizedResume?.skills?.technical?.frameworksAndLibraries?.map((skill, i) => (
                                                <li key={`fw-${i}`}>{skill}</li>
                                            ))}
                                            {optimizedResume?.skills?.technical?.toolsAndBuildSystems?.map((skill, i) => (
                                                <li key={`tool-${i}`}>{skill}</li>
                                            ))}
                                            {optimizedResume?.skills?.technical?.testing?.map((skill, i) => (
                                                <li key={`test-${i}`}>{skill}</li>
                                            ))}
                                            {optimizedResume?.skills?.technical?.practices?.map((skill, i) => (
                                                <li key={`practice-${i}`}>{skill}</li>
                                            ))}
                                            </ul>
                                        </div>
                                        )}

                                        {optimizedResume?.skills?.soft?.length ? (
                                        <div>
                                            <p className="font-semibold">Soft Skills</p>
                                            <ul className="list-disc space-y-2 pl-3">
                                            {optimizedResume?.skills?.soft?.map((skill, i) => (
                                                <li key={`soft-${i}`}>{skill}</li>
                                            ))}
                                            </ul>
                                        </div>
                                        ) : null}

                                        {optimizedResume?.skills?.certifications?.length ? (
                                        <div>
                                            <p className="font-semibold">Certifications</p>
                                            <ul className="list-disc space-y-2 pl-3">
                                            {optimizedResume?.skills?.certifications?.map((skill, i) => (
                                                <li key={`cert-${i}`}>{skill}</li>
                                            ))}
                                            </ul>
                                        </div>
                                        ) : null}
                                    </div>
                                </div>


                            </div>
                            <div className='w-full h-max gap-3 md:gap-5 grid grid-cols-1 md:grid-cols-2'>
                                <div className='w-full rounded-lg flex flex-col gap-5 p-4 h-fit bg-red-300'>
                                    <p className='font-semibold'>Suggested</p>
                                    <p className='font-semibold'>Experience</p>

                                    {originalResume?.experience?.map((exp, index) => (
                                        <div key={index} className="space-y-2 text-sm sm:text-base">
                                        <p className="font-bold">
                                          {exp.heading} | {exp.duration}
                                        </p>
                                        <ul className="space-y-2 list-disc pl-5">
                                          {exp.achievements
                                            .split(/(?<=[.?!])\s+(?=[A-Z])/)
                                            .filter((line) => line.trim() !== '')
                                            .map((ach, j) => (
                                              <li key={`${index}-${j}`}>{ach.trim()}.</li>
                                            ))}
                                        </ul>
                                      </div>
                                    ))}
                                </div>
                                <div className='w-full rounded-lg flex flex-col gap-5 p-4 h-fit bg-green-300'>
                                    <p className='font-semibold'>Suggested</p>
                                    <p className='font-semibold'>Experience</p>

                                    {optimizedResume?.experience?.map((exp, index) => (
                                        <div key={index} className="space-y-2 text-sm sm:text-base">
                                        <p className="font-bold">
                                          {exp.heading} | {exp.duration}
                                        </p>
                                        <ul className="space-y-2 list-disc pl-5">
                                          {exp.achievements
                                            .split(/(?<=[.?!])\s+(?=[A-Z])/)
                                            .filter((line) => line.trim() !== '')
                                            .map((ach, j) => (
                                              <li key={`${index}-${j}`}>{ach.trim()}.</li>
                                            ))}
                                        </ul>
                                      </div>
                                    ))}
                                </div>


                            </div>
                            <div className='w-full h-fit flex items-end justify-end px-4 gap-8'>

                                <button 
                                    onClick={handleBackButton}
                                    className={`px-4 py-1.5 rounded border border-foreground bg-white text-foreground font-bold`}>
                                        Back
                                </button>

                                <button
                                    onClick={handleSecondContinue}
                                    className={`px-4 py-2 rounded bg-blue/600 text-white`}>
                                        Continue
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
    
    </div>
    </div>


   
  )
}

export default UploadSequence

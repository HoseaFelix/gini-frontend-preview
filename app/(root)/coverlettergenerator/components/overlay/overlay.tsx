import LanguageDropdown from '@/app/(root)/resumemanager/components/LanguageDropdown'
import { writeCoverLetter } from '@/lib/actions/resumeAction'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import TemplateCarousel from '../../../../../components/generalComponents/carouselTemplates'
import LoadingStatus from '@/components/generalComponents/loadingStatus'

const Overlay = () => {

  const [currentView, setCurrentView] = useState(0)
  const [language, setLanguage] = useState("English")
  const [description, setJobDescription] = useState("")
  const [canContinue, setCanContinue] = useState(false)
  const [resumeAvailable, setResumeAvailable] = useState(false)
  const [resumeIndex, setResumeIndex] = useState<null|number>(null)
  const [picker, setPicker] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(false)
  const [finishedAnayzing, setFinishedAnalyzing] = useState(false)
  const [loading, setLoading]= useState("")
  const [templateIndex, setSelectedTemplateIndex] = useState<number | null>(null)
  const [savedResume, setSavedResume] = useState<any[]>([])

  const router = useRouter()


  useEffect(() => {
    const stored = localStorage.getItem('savedResume')
    console.log(stored)
    if (stored) {
      setSavedResume(JSON.parse(stored))
    }
  }, [])


    useEffect(()=>{
      if(resumeIndex !== null && description){
        setCanContinue(true)
      }
    },[resumeIndex, description])

  const handleFirstContinue = async ()=>{

    if(resumeIndex == null){
      toast('please select a resume')
      return;
    }

    if(!description){
      toast('please add a description')
      return;
    }


    const rawResume = savedResume[resumeIndex].data
    console.log(rawResume)
    setCurrentView(1)
    localStorage.setItem('selectedResume', JSON.stringify(rawResume))

    try{

      setLoading('ready')
      const data = await writeCoverLetter({description, rawResume, language})

      if(data){
        localStorage.setItem("coverLetter", JSON.stringify(data))

        console.log("Saved cover letter:", localStorage.getItem("coverLetter"))

        toast('cover letter successfully generated')
        setLoading('done')
        setFinishedAnalyzing(true)

       localStorage.setItem('templateIndex',JSON.stringify(templateIndex) )
      }
      


    } catch(e){
      console.error(e)
      toast("Failed to generate cover letter ❌");
      setFinishedAnalyzing(false)
      setLoading("")
      setCurrentView(0)
    }
  }



  useEffect(() => {
  if (savedResume.length > 0) {
    setResumeAvailable(true);
  } else {
    setResumeAvailable(false);
  }
}, [savedResume]);

  const redirectToresumemanager = ()=>{
    router.push('/resumemanager')
  }

  const togglePicker = ()=> setPicker((prev)=>!prev)

  const handleResumeIndex = (index)=>{
    setResumeIndex(index)
    togglePicker()
  }
  
  const templates = [
    '/img/carouseltemplate1.png',
    '/img/carouseltemplate2.png',
    '/img/carouseltemplate3.jpg',
    
  ]

  const handleSelect= (index)=>{
    setSelectedTemplateIndex(index)
  }


  const handleLastContinue = ()=>{
    if(finishedAnayzing){
      
      setSelectedTemplate(true)
    } else if(!finishedAnayzing){
      setSelectedTemplate(true)
      
      
      
    }
  }
  const totalItems = 2

  const collectJobDescription = (e : any)=>{
    setJobDescription(e.target.value)
  }

  useEffect(() => {
  if (selectedTemplate && finishedAnayzing) {
     localStorage.setItem('typeCoverLetter',JSON.stringify({
        type: 'new',
        index: ''
      }))
    router.push(`/coverlettergenerator/covertemplate${templateIndex + 1}`)
    localStorage.setItem('templateIndex', JSON.stringify(templateIndex))
  }
}, [selectedTemplate, finishedAnayzing, templateIndex, router])


  
  return (
    <section className='w-full h-full p-4 overflow-hidden flex flex-col gap-5 relative'>

      {/* progres bars */}
      <div className="w-full overflow-x-hidden z-20 h-max max-w-2xl mx-auto">
        <div className=' h-fit w-full px-2 sm:px-4 mx-auto flex flex-nowrap gap-1 sm:gap-2 md:gap-5'>
            <div className='h-2 flex-1 min-w-0 rounded-lg bg-blue-500'></div>
            <div className={`h-2 flex-1 min-w-0 rounded-lg ${currentView >= 1 ? 'bg-blue-500' : 'bg-text/60'}`}></div>
            </div>
      </div>

      <div className='slide-containter w-full h-full relative overflow-hidden'>
        <div 
          className='mt-10 grid-cols-2 grid transition-transform duration-500'
          style={{
            width: `${totalItems*100}%`,
            transform:` translateX(-${currentView * (100/totalItems)}%)`
          }}
        >
          {/* slide 1 */}

          <div className='w-full h-full flex flex-col gap-10'>

            <div className='w-full max-w-2xl h-max mx-auto flex flex-col space-y-5'>
              <div className='p-2 flex justify-between border-2 rounded-lg '>
                <p>{resumeIndex !== null ? savedResume[resumeIndex].file_name : 'No resume seleted'}</p>

                {resumeAvailable && (
                  <div 
                  onClick={togglePicker}
                  className='opacity-70 h-fit w-fit hover:cursor-pointer'>
                    {resumeIndex !== null ? 'Change' : 'Select Resume'}
                  </div>
                )}

                {!resumeAvailable && (
                  <div
                    onClick={redirectToresumemanager} 
                    className='opacity-70 h-fit w-fit hover:cursor-pointer'>Create resume
                    
                  </div>
                )}
                

              </div>

              <div className='border rounded-lg p-4 border-black flex flex-col gap-5'>
                <LanguageDropdown setLanguage={setLanguage}/>

                <textarea className='border border-text/50 px-4 py-2 min-h-[200px] rounded-lg w-full ' value={description} onChange={collectJobDescription} />

              </div>

            </div>

            <div className='w-full h-fit flex items-end justify-end gap-3 '>
              <button
                onClick={handleFirstContinue}
                className={`px-4 py-2 rounded ${canContinue? 'bg-blue-600': 'bg-text/50'} text-white`}
              
              >
                Continue

              </button>

            </div>

            

          </div>

          {/* slide 2 */}

          <div className={`w-full h-full flex flex-col gap-5`}>
            {
              selectedTemplate && (
              <div className='flex gap-2'>
              <LoadingStatus loading={loading}/>
              generating cover letter ...

            </div>

              )
            }
           
            <div className={`${selectedTemplate ? 'hidden' : ''} w-full min-h-[360px] relative`}>
              <TemplateCarousel images={templates} onSelect={handleSelect} />

            </div>

            <div className={`${selectedTemplate ? 'hidden' : ''} w-full h-fit flex items-end justify-end gap-3 `}>
              <button
                onClick={handleLastContinue}
                className={`px-4 py-2 rounded ${canContinue? 'bg-blue-600': 'bg-text/50'} text-white`}
              
              >
                Continue

              </button>

            </div>

          </div>





        </div>

      </div>

      {/* resume picker */}
      <div className={`${picker ? '': 'hidden'} absolute bg-white border shadow-md rounded-lg backdrop:saturate-150 backdrop:blur-md inset-4 md:inset-10` }>
        <div className='w-full flex flex-col px-4 md:px-10 gap-3'>
          <p className='mx-auto font-bold mt-5 text-xl'>Select Resume</p>

          {savedResume.length>0 && savedResume.map((resume, index)=>(

            <div 
              onClick={()=>handleResumeIndex(index)}
              key={index} 
              className={`w-full p-4 border rounded-md hover:cursor-pointer ${resumeIndex == index ? 'border-foreground': ''}  `}>
              {resume.file_name}

            </div>

          ))}

        </div>

      </div>


        
    </section>
  )
}

export default Overlay

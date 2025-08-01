'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { extractTextFromFile } from '@/lib/constants/constants'
import { formatTextWithAi, optimizeResumeWithAi } from '@/lib/actions/general.actions'
import LoadingStatus from '@/components/generalComponents/loadingStatus'
// import { useResumeStore } from '@/store/resumeStore'

const UploadSequence = () => {
  const totalItems = 3
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
        setUploadStart(true)
        setUploadingFile('ready')
        const rawText = await extractTextFromFile(document)

        //handles errors
        if(rawText == 'Unsupported file type'){
            toast.error('Unsupported file type');
            setUploadStart(false)
            return;
        } 

        setUploadingFile('done')
        setAnalyzingDoc('ready')
        
        //sends the raw text to Ai to format

        const analyzeDoc = await formatTextWithAi(rawText)

        if(analyzeDoc?.success == true){
            setAnalyzingDoc('done')
            setUploadStart(false)
            setCurrentView((prev)=> (prev + 1) % totalItems )


        } else {
            //error handling
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

  //handles job description collection 
   const collectJobDescription = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setDescription(e.target.value)

   }

   //handles the back buttons 
   const handleBackButton = ()=>{
    setCurrentView((prev)=> prev -1)
   }

   //handles the second continue button which sends the description along with the formatted resume to the Ai for processing  
   const handleSecondContinue = async ()=>{

    if(!description) {
        toast.error('enter description pleae')
        return;
    }


    try{
        setScanStart(true)
        setScanning('ready')
        const optimizeResume = await optimizeResumeWithAi({description})
        setGenImprov('ready')
        if(optimizeResume?.success){
            setScanning('done')
            setGenImprov('done')
            setCurrentView((prev)=> prev + 1)
        }

    } catch(error){
        console.log(error)
    }
    


   }


  return (

    <div className='flex flex-col'>

            {/* top bars */}
            <div className='w-full h-fit lg:w-4xl mx-auto flex flex-nowrap gap-2 md:gap-5'>
                        <div className='h-2 w-full rounded-lg bg-blue-500 '></div>
                        <div className={`h-2 w-full rounded-lg ${currentView >= 1 ? 'bg-blue-500 ' : 'bg-text/60'} `}></div>
                        <div className={`h-2 w-full rounded-lg ${currentView == 2 ? 'bg-blue-500 ' : 'bg-text/60'} `}></div>

            </div>
            <div className='w-full h-full overflow-hidden pb-10'>
                <div
                    className='flex transition-transform duration-500'
                    style={{
                    width: `${totalItems * 100}%`,
                    transform: `translateX(-${currentView * (100 / totalItems)}%)`
                    }}
                >
                    {/* Slide 1 */}
                    <div className='w-full flex flex-col gap-10 items-center'>
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
                            
                                <div className='flex flex-col md:flex-row gap-10 mt-20'>
                            <div className='relative'>
                            <input
                                id="fileUpload"
                                type="file"
                                className='hidden'
                                onChange={handleDoc}
                            />
                            <label htmlFor="fileUpload">
                                <div className='w-[250px] h-[250px] border rounded-lg border-text/50 flex items-center justify-center hover:cursor-pointer flex-col gap-5 pt-7'>
                                <div className='flex items-center justify-center p-2 rounded bg-text/30'>
                                    <Image
                                    src={"/icons/create.png"}
                                    width={20}
                                    height={20}
                                    alt='create icon'
                                    />
                                </div>
                                <p>Upload from local storage</p>
                                
                                </div>
                            </label>
                            </div>

                            <div className='w-[250px] h-[250px] border rounded-lg border-text/50 items-center justify-center hover:cursor-pointer flex flex-col gap-5 pt-7'>
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

                                <div className='w-full h-fit flex items-end justify-end px-4'>
                                    <button
                                    onClick={handleFirstContinue}
                                    className={`px-4 py-2 rounded ${canContinue ? 'bg-blue-600' : 'bg-text/50'} text-white`}
                                    >
                                    Continue
                                    </button>
                                </div>
                            </>
                        )}
                        
                    </div>

                    {/* Slide 2 */}
                    <div className='w-full flex items-center justify-center flex-col gap-10'>

                        {isScanStart && (

                            <>
                            
                            <div className='flex mt-10 flex-col w-full gap-2'>
                                    <div className='flex gap-5'>
                                        <LoadingStatus loading={isScanning}/> <p>{isScanning == 'done' ? 'Scanned for improvement' : 'Scanning for improvement...' }</p>

                                    </div>
                                    <div className='flex gap-5'>
                                        <LoadingStatus loading={generateImprov}/> <p>{generateImprov == 'done' ?   'Generating suggestions' : 'suggestions generated'}</p>

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
                                            <p className='font-bold text-xl'>Add job description</p>
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
                    <div className='w-full flex items-center justify-center'>
                    <p>Slide 3 content here</p>
                    </div>
                </div>
            </div>
    
    </div>
   
  )
}

export default UploadSequence

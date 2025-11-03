import { answerUser } from '@/lib/actions/general.actions';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

const Aihelp = ({toggleChat, handleToggleChat}: {toggleChat: boolean, handleToggleChat: ()=> void}) => {



  
    const [chat, setChat] = useState<chatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{

        setInput(e.target.value)

    }

    const handleSubmit = async()=>{
        if(!input) {
            return
        }

        setLoading(true)
        const newChat: chatMessage[] = [
            ...chat,
            { role: 'user', message: input }
        ];
        
        setChat(newChat);

        console.log(chat)

        setInput('')

        try{
            const answer = await answerUser(newChat)

            if(answer.success) {
                setChat(prev => [
                    ...prev,  {
                        role:'assistant',
                        message: answer.message
                    }
                ])
                
                setLoading(false)
    
            } else{
                toast.error(`${answer.message}, please check your internet and try again`)
                setLoading(false)
            }

        } catch(e){
            setLoading(false)
            console.log(e)
        }

       
    }

    const endMessageRef = useRef<HTMLDivElement| null> (null)

    useEffect(()=>{
        endMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [chat])
    



  return (
    <div 
    className={`${!toggleChat ? 'hidden' : ''} fixed w-full h-[85dvh] md:w-[450px] md:h-[650px] right-0 max-sm:top-20  max-sm:bottom-20 md:right-5 z-150 md:bottom-10 bg-white rounded-md `}>
      <div 
        className='h-full p-4 w-full  flex flex-col relative pb-3'
      > 

            {/* handles chat close */}
                <div 
                onClick={handleToggleChat}
                className='hover:cursor-pointer w-max h-max absolute top-4 right-4 z-20'>
                <Image
                src={'/icons/close.png'}
                width={20}
                height={20}
                alt='close icon'
                className=''
                />

                </div>

                {/* top chat bar */}
                <div className='w-full h-fit py-1 px-2 backdrop:saturate-150 bg-white/50
                sticky top-4 font-bold'>
                Get assistance with Ai
                </div>

                {/* chat body */}

                <div className=' w-full h-full flex flex-col gap-2 overflow-y-auto pr-2 py-10 relative '>
                    {chat.length > 0 && (
                        chat.map((sentence, index)=>(
                            <div 
                                key={index}
                                className={`w-full h-fit flex ${sentence.role == 'user' ? 'justify-end': 'justify-start'}`}>
                                <div className={`max-w-[75%] h-fit w-fit p-3 rounded-md ${sentence.role == 'user' ? 'bg-blue-500': 'bg-text/50'}`}>
                                    {sentence.message}

                                </div>

                            </div>
                        ))
                    )}

                    {loading && (
                        <div className='w-full h-fit justify-start'>
                            <div className='w-[15px] h-[15px] bg-black rounded-full animate-pulse'>

                            </div>

                        </div>
                    )}

                    
                    <div ref={endMessageRef}/>

                    {/* input field */}
                    <div className='absolute bottom-0 inset-x-4 h-fit
                    '>
                        <div className='w-full h-fit flex-nowrap flex gap-5 rounded-lg bg-white/50 backdrop:saturate-150 backdrop:blur-md shadow items-center justify-between'>
                        
                            <input 
                                onChange={handleChange}
                                value={input}
                                type="text" 
                                className='hover:outline-0 px-2 py-2 h-fit max-h-[100px] min-w-[80%] border-0  focus:outline-0' 
                                placeholder='enter query here'
                            
                            />

                            <button
                            onClick={handleSubmit}
                            className='hover:cursor-pointer'
                            >
                                <Image
                                    src='/icons/message.png'
                                    width={30}
                                    height={30}
                                    alt='message icon'
                                />

                            </button>

                        </div>

                    </div>

                </div>
    





            


            </div>

        </div>
  )
}

export default Aihelp

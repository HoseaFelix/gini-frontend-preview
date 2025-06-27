'use client'


import React, { useCallback, useEffect, useRef, useState } from 'react'
import { testimonials } from '@/constants'
import Image from 'next/image'

const Testimonials = () => {

    const [currentSlide, setCurrentSlide] = useState(0)
    const intervalId = useRef<NodeJS.Timeout | null>(null)

    const totalLength = testimonials.length


    const startAutoSlide = useCallback(() => {
        intervalId.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalLength);
        }, 4000);
    }, [totalLength]);

    useEffect(()=>{
        startAutoSlide()

        return () => {
            if(intervalId.current) clearInterval(intervalId.current)
        }
    }, [startAutoSlide])


    const handleClick = (index : number )=>{
        setCurrentSlide(index)
        
    }



  return (
    <section className='h-fit py-20 w-full bg-[#D5E0F6] relative '>
        <div className='h-full w-full relative flex flex-col  px-4 md:px-10 lg:px-20 xl:px-80 gap-5 overflow-hidden '>
             <h1 className='w-fit mx-auto font-bold text-xl'>Testimonials</h1>

             <div className='w-full h-full overflow-hidden rounded-2xl'>
             <div 
                className='flex h-full w-full overflow-hidden slider rounded-2xl '
                style={{
                    width:`${totalLength * 100}%`,
                    transform:` translateX(-${currentSlide * (100/totalLength)}%)`
                }}

             >
                {testimonials.map(({imageUrl, name, workPosition, state, topic, subText}, index)=>(
                    <div 
                    key={index}
                    className='testimonial-carousel h-fit flex-1 flex flex-col bg-[#80A2E5] rounded-2xl p-4 '>
                        <div className='flex  gap-5 w-full h-fit items-center'>
                            <div className='h-[80px] w-[80px] relative rounded-full overflow-hidden'>
                                <Image
                                    fill
                                    alt='testimony image'
                                    src={imageUrl}
                                    className='object-cover'
                                />
    
                            </div>
    
                            <div className='w-fit h-fit '>
                                <p className='font-bold text-xl'>{name}</p>
                                <p className='text-sm' >{workPosition}, {state}</p>
    
                            </div>
                        </div>
                        <div className='w-full h-fit py-5'>
                            <p className='text-sm font-bold'>{topic}</p>
                            <p>
                                {subText.split('. ').map((sentence, i) => (
                                    <React.Fragment key={i} >
    
                                        {sentence.trim()}
                                        {i < subText.split('. ').length - 1 && '.'}
                                        <br/>
                                    </React.Fragment>
                                ))}
                            </p>
    
                        </div>
    
    
                    </div>
                ))}
                

             </div>
             </div>

            

            

        </div>

        <div className='flex w-fit mx-auto mt-10 '>
            <ul className='flex  gap-2 items-center '>
                {testimonials.map((testimonial, index)=>(
                    <li 
                        className={` rounded-full bg-[#80A2E5] ${index == currentSlide ? 'selected bg-[#295FCC]': 'w-[16px] h-[16px]'} hover:cursor-pointer`}
                        key={index}
                        onClick={()=>handleClick(index)}
                        
                    ></li>
                ))}
            </ul>

        </div>


    </section>
  )
}

export default Testimonials

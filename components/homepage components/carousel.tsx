'use client'


import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'



const Carousel = () => {

    const sliderRef = useRef<HTMLDivElement> (null)

    const [currentSlide, setCurrentSlide] = useState(0)
    const intervalId = useRef<NodeJS.Timeout | null>(null)


    const carouselItems = [
        {
            image:'/img/carousel-preview.jpg',
            text: 'Unlock Job Landing Presentation tools With AideGini',
        },
    
    ]

    const totalItems = carouselItems.length;

    

  
   

    const startAutoSlide = useCallback(() => {
        intervalId.current = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % totalItems);
        }, 4000);
      }, [totalItems]);

    useEffect(()=>{
        startAutoSlide()

        return () => {
            if (intervalId.current) clearInterval(intervalId.current)
          }
    }, [startAutoSlide])


    const nextSlide=()=>{
        setCurrentSlide((prev) => (prev + 1) % totalItems)
        startAutoSlide()
    }

    const prevSlide=()=>{
        setCurrentSlide((prev)=> prev === 0 ? totalItems - 1 : prev - 1)
        startAutoSlide()
    }

    

    const handleLiClick = (index: number)=>{
        setCurrentSlide(index)
        startAutoSlide()

    }
    
    





  return (
    <div className='w-full h-full '>
        <div className='carousel b-2 h-full w-full overflow-hidden relative xl:min-h-[500px] '>
            <div 
                ref={sliderRef}
                className={`slider h-full flex  text-white`}
                style={{
                    width:`${totalItems * 100}%`,
                    transform: `translatex(-${currentSlide * (100/totalItems)}%)`
                }}
            
            >
                {carouselItems.map(({image, text}, index)=>(
                    <section key={index} className='relative '
                        style={{ width: `${100/totalItems}%`}}
                    >
                        {image ? 
                                <Image
                                    fill
                                    src={image}
                                    className='object-cover object-top'
                                    alt={`section ${index + 1} image`}
                                />
                        
                            : `carousel ${index + 1}`
                        }

                        {
                            text && (

                                <div className='absolute top-0 left-0 h-full w-full  flex'>
                                    <div className=' h-full w-full flex items-end pb-20'>
                                        <div className='h-max w-full flex items-center justify-center flex-wrap font-bold max-sm:text-xl text-4xl px-5 md:px-15 leading-[133%]'>
                                                {text}
                                        </div>

                                    </div>
                                </div>
                                
                            )
                        }


                    </section>
                ))}
            </div>
            <div className='controls'>
                <span className='arrow left'
                    onClick={prevSlide}
                >
                    <Image
                        src='/icons/arrowLeft.png'
                        alt='left'
                        width={13}
                        height={28.5}
                    />
                </span>
                <span className='arrow right'
                    onClick={nextSlide}
                >
                    <Image
                        src='/icons/arrowRight.png'
                        alt='right'
                        width={13}
                        height={28.5}
                        className='m-auto'
                    />
                </span>

                <ul className='absolute bottom-5 gap-2 items-center hero-control-ul '>
                    {carouselItems.map((items, index)=>(
                        <li key={index} className={`rounded-full hover:cursor-pointer  ${index == currentSlide ? 'selected bg-[#295FCC]': 'bg-white'} `
                        
                       
                    
                        } 
                        onClick={(()=>handleLiClick(index))}
                    
                    ></li>
                    ))}
                </ul>
                
            </div>

            

        </div>
      
    </div>
  )
}

export default Carousel

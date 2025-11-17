'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { testimonials } from '@/constants'

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalId = useRef<NodeJS.Timeout | null>(null)

  // Clear interval function
  const clearAutoSlide = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
  }, [])

  // AUTO SLIDE
  const startAutoSlide = useCallback(() => {
    if (!testimonials || testimonials.length === 0) return

    clearAutoSlide() // Clear any existing interval first
    
    intervalId.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length)
    }, 10000)
  }, [clearAutoSlide])

  useEffect(() => {
    startAutoSlide()
    return () => clearAutoSlide()
  }, [startAutoSlide, clearAutoSlide])

  const handleClick = (index: number) => {
    clearAutoSlide() // Clear interval when dot is clicked
    setCurrentSlide(index)
    startAutoSlide() // Restart the interval
  }

  return (
    <section id='testimonial' className="h-max py-20 w-full bg-[#D5E2F6] relative">
      <div className="h-full w-full flex flex-col px-4 md:px-10 lg:px-20 xl:px-80 gap-5 overflow-hidden">
        <h1 className="w-fit mx-auto font-bold text-xl">Testimonials</h1>

        {/* CAROUSEL WRAPPER */} 
        <div className="w-full overflow-hidden rounded-2xl min-h-[350px]">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / testimonials.length)}%)`,
              width: `${testimonials.length * 100}%`,
            }}
          >
            {testimonials.map((t, index) => {
              const { imageUrl, name, workPosition, state, topic, subText } = t

              return (
                <div
                  key={index}
                  className="flex flex-col bg-[#80A2E5] rounded-2xl p-4"
                  style={{
                    width: `${100 / testimonials.length}%`,
                  }}
                >
                  {/* HEADER */}
                  <div className="flex gap-5 items-center">
                    <div className="h-[80px] w-[80px] relative rounded-full overflow-hidden">
                      <Image
                        fill
                        alt="Testimonial Image"
                        src={imageUrl}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xl">{name}</p>
                      <p className="text-sm">{workPosition}, {state}</p>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="w-full py-5">
                    <p className="text-sm font-bold">{topic}</p>
                    <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-line">
                      {subText}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* DOT INDICATORS */}
      <div className="flex w-fit mx-auto mt-10">
        <ul className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <li
              key={index}
              onClick={() => handleClick(index)}
              className={`rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-[#295FCC] w-[20px] h-[20px]'
                  : 'bg-[#80A2E5] w-[16px] h-[16px]'
              } hover:cursor-pointer`}
            ></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Testimonials
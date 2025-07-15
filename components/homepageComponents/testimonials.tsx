'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { testimonials } from '@/constants';

// interface Testimonial {
//   imageUrl: string;
//   name: string;
//   workPosition: string;
//   state: string;
//   topic: string;
//   subText: string;
// }

const Testimonials = () => {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([])
//   const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalId = useRef<NodeJS.Timeout | null>(null)

//   const fetchTestimonials = async () => {
//     try {
//       const res = await fetch('https://aidgeny.onrender.com/api/testimony',
//         {credentials: 'include'}
//       )
//       if (!res.ok) throw new Error('Failed to fetch testimonials')
//       const data = await res.json()
//       setTestimonials(data)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchTestimonials()
//   }, [])



  const startAutoSlide = useCallback(() => {
    if (testimonials.length === 0) return
    intervalId.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 4000)
  },[])

  useEffect(() => {
    startAutoSlide()
    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [startAutoSlide])

  const handleClick = (index: number) => {
    setCurrentSlide(index)
  }

//   if (loading) return <div className="text-center">Loading testimonials...</div>
//   if (testimonials.length === 0) return <div className="text-center">No testimonials yet.</div>

  return (
    <section className="h-fit py-20 w-full bg-[#D5E0F6] relative">
      <div className="h-full w-full relative flex flex-col px-4 md:px-10 lg:px-20 xl:px-80 gap-5 overflow-hidden">
        <h1 className="w-fit mx-auto font-bold text-xl">Testimonials</h1>

        <div className="w-full h-full overflow-hidden rounded-2xl">
          <div
            className="flex h-full w-full overflow-hidden slider rounded-2xl"
            style={{
              width: `${testimonials.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / testimonials.length)}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            {testimonials.map((t, index) => {
              const { imageUrl, name, workPosition, state, topic, subText } = t
              return (
                <div
                  key={index}
                  className="testimonial-carousel min-w-full h-fit flex flex-col bg-[#80A2E5] rounded-2xl p-4"
                >
                  <div className="flex gap-5 w-full h-fit items-center">
                    <div className="h-[80px] w-[80px] relative rounded-full overflow-hidden">
                      <Image
                        fill
                        alt="testimony image"
                        src={imageUrl}
                        className="object-cover"
                      />
                    </div>
                    <div className="w-fit h-fit">
                      <p className="font-bold text-xl">{name}</p>
                      <p className="text-sm">{workPosition}, {state}</p>
                    </div>
                  </div>
                  <div className="w-full h-fit py-5">
                    <p className="text-sm font-bold">{topic}</p>
                    <p>
                      {subText.split('. ').map((sentence, i) => (
                        <React.Fragment key={i}>
                          {sentence.trim()}
                          {i < subText.split('. ').length - 1 && '.'}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex w-fit mx-auto mt-10">
        <ul className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <li
              key={index}
              onClick={() => handleClick(index)}
              className={`rounded-full bg-[#80A2E5] ${
                index === currentSlide ? 'selected bg-[#295FCC]' : 'w-[16px] h-[16px]'
              } hover:cursor-pointer`}
            ></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Testimonials

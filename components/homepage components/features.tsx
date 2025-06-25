import React from 'react'
import FeatureWrapper from './featuresPageComponents/featureWrapper'

const Features = () => {
  return (
    <section className='w-full min-h-screen bg-[#EAEAFB]'>
      <div className='h-full w-full pt-10  px-4 md:px-20' >
          <h2 className='w-fit mx-auto font-bold text-xl'>Features</h2>

          <div className='flex flex-col w-full pb-20'>
              <FeatureWrapper/>
          </div>
      </div>

        
    </section>
  )
}

export default Features

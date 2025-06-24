import React from 'react'
import ImageFrame from './image'
import Description from './description'
import { features } from '@/constants'

const FeatureWrapper = () => {
  return (
    <div className='space-y-20'>
      {
        features.map(({header, subtext}, index) => (
          <div
            key={index} 
            className='grid grid-cols-1 md:grid-cols-2 h-[445px] gap-20 mt-15 relative mx-auto w-full justify-between md:px-10 lg:px-20 xl:px-30'
          >
            {
            
            (index + 1) % 2 !== 0 ? (
              <>
                    <ImageFrame
                      imageUrl={`/img/feature${index+1}.png`}
                  />

                  <div className='max-sm:absolute sm:inset-0 '>
                    <Description
                      header={header}
                      subtext={subtext}
                    />
                  </div>
              </>
             
            ) : (

              <>
                  <div className='max-sm:absolute sm:inset-0 z-10 '>
                    <Description
                      header={header}
                      subtext={subtext}
                    />
                  </div>

                  <ImageFrame
                      imageUrl={`/img/feature${index+1}.png`}
                  />

              
              </>

            )
               
            
             }
            
          </div>
        ))
      }
    </div>
  )
}

export default FeatureWrapper

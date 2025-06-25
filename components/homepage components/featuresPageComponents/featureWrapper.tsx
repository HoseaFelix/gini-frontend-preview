import React from 'react'
import ImageFrame from './image'
import Description from './description'
import { features } from '@/constants'

const FeatureWrapper = () => {
  return (
    <div className='space-y-20 max-sm:rounded-2xl max-sm:overflow-hidden'>
      {
        features.map(({header, subtext}, index) => (
          <div
            key={index} 
            className='grid grid-cols-1 min-md:grid-cols-2 h-[445px] gap-20 mt-15 relative mx-auto w-full justify-between md:px-10 lg:px-20 xl:px-30 max-md:rounded-2xl max-md:overflow-hidden'
          >
            {
            
            (index + 1) % 2 !== 0 ? (
              <>
                    <ImageFrame
                      imageUrl={`/img/feature${index+1}.png`}
                  />

                  <div className='max-md:absolute z-10  max-md:top-0 max-md:bottom-0  max-md:inset-x-0'>

                  <div className='h-full w-full  flex  items-end md:items-center '>
                      <Description
                        header={header}
                        subtext={subtext}
                      />

                  </div>

                  </div>
              </>
             
            ) : (

              <>
                  <div className='max-md:absolute z-10  max-md:top-0 max-md:bottom-0  max-md:inset-x-0'>

                    <div className='h-full w-full  flex items-end md:items-center  '>
                        <Description
                          header={header}
                          subtext={subtext}
                        />

                    </div>
                   
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

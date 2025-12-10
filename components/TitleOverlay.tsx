// import Image from 'next/image'
// import React, { useState } from 'react'
import CloseIcon from './generalComponents/closeIcon'

const TitleOverlay = ({isVisible, setVisiblity, collectTitle, handleSave, type}) => {

  return (
    <div className={` ${!isVisible ? 'hidden' : ''} absolute w-full h-max py-5 max-w-2xl mx-auto bg-white shadow-md top-10 rounded-lg overflow-hidden z-300 min-h-[300px]  `}>
        <div className='w-full h-full relative items-center flex px-4 justify-center flex-col gap-10 py-5  '>
            <CloseIcon OnClick={setVisiblity} containerClass={`top-4 right-4`}/>
            <div className='mt-5'></div>
            <div className='w-full max-w-xl h-max p-4 border border-foreground rounded-md mx-auto  flex flex-col gap'>
                <p>Give your {type} a title</p>

                <input onChange={collectTitle} type="text"  className='w-full p-1 border rounded-md '/>

            </div>

            <div  className='button-div flex w-full items-end justify-end'>
              <button onClick={handleSave} className=' hover:cursor-pointer font-bold text-white bg-foreground px-3 py-1 rounded-md'>
                Save
              </button>

            </div>

        </div>

    </div>
  )
}

export default TitleOverlay

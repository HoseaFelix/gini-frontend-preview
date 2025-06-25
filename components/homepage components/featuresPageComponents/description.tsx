import React from 'react'


const Description = ({header, subtext}: DescriptionProps) => {
  return (
    <div className='flex h-full w-full md:items-center  justify-end md:justify-between z-10'>

        <div className='flex flex-col h-fit w-fit gap-5 max-md:px-4 max-md:text-white'>
            <h2 className='font-bold text-2xl'>{header}</h2>
            <p>{subtext}</p>
        </div>

       
      
    </div>
  )
}

export default Description

import React from 'react'

const Amended = ({type, heading, subText}: {type: string, heading:string, subText: string}) => {
  return (
    <div className={`${type== 'current' ? 'bg-red-300' : 'bg-green-300'} w-full rounded-lg flex flex-col gap-5 p-4 h-fit`}>
      <p>{type}</p>
      <p className='font-bold text-lg'>{heading == 'undefined' ? 'Not available' : heading}</p>
      <p>{subText == 'undefined' ? 'Not available' : subText}</p>
    </div>
  )
}

export default Amended

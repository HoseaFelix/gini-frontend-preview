import Image from 'next/image'
import React from 'react'

const ImageFrame = ({imageUrl}:{imageUrl: string}) => {
  return (
    <div className='h-full w-full relative rounded-2xl overflow-hidden'>
      <Image
        className='object-cover'
        fill
        alt='feature1'
        src={imageUrl}
      />
    </div>
  )
}

export default ImageFrame

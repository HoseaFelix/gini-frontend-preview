import Image from 'next/image'
import React from 'react'

const CloseIcon = ({containerClass, OnClick}) => {
  return (
    <div
    
    onClick={OnClick}
    
    className={` ${containerClass} absolute  h-max w-max hover:cursor-pointer`}>
        <Image
            src='/icons/close.png'
            height={20}
            width={20}
            alt='close icon'
        />

    </div>
  )
}

export default CloseIcon

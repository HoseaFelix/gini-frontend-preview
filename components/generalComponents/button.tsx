import Link from 'next/link'
import React from 'react'

const Button = ({containerClass, title, href }: ButtonProps) => {
  return (
    <Link href={href} className='hover:cursor-pointer'>
        <button className={`${containerClass} text-sm font-bold capitalize hover:cursor-pointer`}>
            {title}
        </button>
    </Link>
  )
}

export default Button

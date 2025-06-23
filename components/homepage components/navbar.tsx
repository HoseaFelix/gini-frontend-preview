import React from 'react'
import {navLinks} from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../generalComponents/button'


const Navbar = () => {
  return (
    <nav className='z-100 absolute top-10 h-[72px] inset-x-10 bg-white/50 rounded-xl backdrop-blur-md backdrop-saturate-150 flex items-center justify-between px-10 py-5 font-bold '>

        <h1 className='text-white text-2xl font-bold hover:cursor-pointer '>
            AideGini
        </h1>
        
        <div className='flex justify-between items-center text-foreground text-sm gap-5 '>

            <div className='flex justify-between w-fit font-bold'>
                <p className='hover:cursor-pointer '>Products</p>
                <select name="" id="" className='hover:cursor-pointer'></select>
            </div>

            <div className='flex justify-between w-fit font-bold gap-5'>
                {navLinks.map(({href, name}, index)=>(
                    <Link key={index} href={href}>{name}</Link>
                ))}
            </div>

            <div className='flex w-fit items-center justify-between'>
                <Image width={20} height={20} alt='globe icon' src='/icons/globe.svg' />

                <select name="lang" id="">
                    <option value="">EN</option>
                </select>
                
            </div>

            <Button
                href=''
                title='get started'
                containerClass='bg-foreground text-white px-3 py-2 rounded-sm '
            
            />

        </div>


    </nav>
  )
}

export default Navbar

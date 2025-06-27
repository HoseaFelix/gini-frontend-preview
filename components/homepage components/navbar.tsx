'use client'

import React, { useState } from 'react'
import {navLinks} from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../generalComponents/button'


const Navbar = () => {


    const [isOpen, setIsOpen] = useState(false)

    const toggleNav = ()=>{
        setIsOpen((prev) => !prev)
    }

  return (
    <>
           <nav className='z-100 fixed h-[72px] inset-x-0 top-0 bg-white/50  backdrop-blur-md backdrop-saturate-150 flex items-center justify-between px-4 md:px-10 py-5 font-bold overflow-hidden'>

                <h1 className='text-foreground text-2xl font-bold hover:cursor-pointer '>
                    AideGini
                </h1>

                <div className=' justify-between items-center text-foreground text-sm gap-5 hidden md:flex'>

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

                <div className='h-[44px] w-[44px] flex flex-center hover:cursor-pointer md:hidden' 
                onClick={toggleNav}
                >
                <Image
                    width={24}
                    height={24}
                    alt='hamburger menu'
                    src={isOpen ? '/icons/close.png' : '/icons/hamburger.png'}
                />

                </div>

            </nav>  
            <div className={`nav-sidebar text-white overflow-y-auto ${isOpen ? 'max-h-screen' : 'max-h-0'} md:hidden `}>
                <div className='h-full w-full pt-20'>
                        <div className=' justify-between px-4 text-white text-lg gap-5 flex flex-col'>

                            <div className='flex justify-between w-fit font-bold'>
                                <p className='hover:cursor-pointer '>Products</p>
                                <select name="" id="" className='hover:cursor-pointer'></select>
                            </div>

                            <div className='flex flex-col justify-between w-fit font-bold gap-5'>
                                {navLinks.map(({href, name}, index)=>(
                                    <Link key={index} href={href}>{name}</Link>
                                ))}
                            </div>

                            <div className='flex w-fit items-center justify-between'>
                                <Image width={20} height={20} alt='globe icon' src='/icons/globe.svg' 
                                className='invert'
                                />

                                <select name="lang" id="">
                                    <option value="">EN</option>
                                </select>
                                
                            </div>

                            <Button
                                href=''
                                title='get started'
                                containerClass='bg-white  text-foreground px-3 py-2 rounded-sm '

                            />

                        </div>

                </div>
            </div>    
    
    </>
   
  )
}

export default Navbar

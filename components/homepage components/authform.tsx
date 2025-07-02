'use client'

import Image from 'next/image'
import React from 'react'

import Link from 'next/link'

const AuthForm = ({type}: {type:authType}) => {
    



    const isSignUp = type == 'sign-up'

    

  return (
    <div className='min-w-[300px] w-fit max-w-[524px] h-fit bg-white shadow-md py-10 px-4 md:px-20 rounded-md flex items-center justify-center flex-col' >
        <p className='font-bold text-xl md:text-xl'>
            {isSignUp ? 'Fill out the form below to sign up': 'Welcome back'}
        </p>

        <form action="" className='w-full mt-5 auth-form flex flex-col gap-3'>
            {isSignUp && (
                <>
                    <label htmlFor="" className=''>First Name</label>
                    <input 
                        type="text" 
                        
                        name='firstName'  
                        className=' focus:outline-none focus:ring-2 focus:blue-500/70 focus:border-blue-500/70' />

                </>
            )}
            


            <label>
                Email
            </label>
            <input type="email" name='email'/>

            <label htmlFor="">Password</label>
            <input type="text" placeholder='Minimum 8 characters' />

            {isSignUp && (
                <>
                    <label htmlFor="">Confirm Password</label>
                    <input type="text" />
                </>
            )}

            <button 
                
                type='submit'
                className='w-full h-fit py-3 bg-foreground text-white rounded-lg font bold mt-2 hover:cursor-pointer'>
                {isSignUp ? 'Sign up' : 'Sign in'}

            </button>
        </form>

        <div className='w-fit h-fit gap-10 flex mt-10'>
            <div className='flex-col flex h-fit w-fit gap-3 items-center hover:cursor-pointer'>
                <Image
                    width={32}
                    height={32}
                    src='/icons/linkedin.png'
                    alt='linkedin icon'
                />
                <p className='text-sm font-bold'>
                    LinkedIn
                </p>

            </div>
            <div className='flex-col flex h-fit w-fit gap-3 items-center hover:cursor-pointer'>
                <Image
                    width={32}
                    height={32}
                    src='/icons/google.png'
                    alt='google icon'
                />
                <p className='text-sm font-bold'>
                    Google
                </p>

            </div>

        </div>

        <p className='text-sm font-bold mt-10'>
            Already have an account? <Link href={`${isSignUp ? '/sign-in' : 'sign-up'}`} className='text-link underline underline-offset-1 hover:cursor-pointer'>{isSignUp ? 'Login' : 'Sign up'}</Link>
        </p>


      
    </div>
  )
}

export default AuthForm

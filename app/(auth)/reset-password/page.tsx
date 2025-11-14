
import AuthForm from '@/components/authForm'
import React from 'react'

const SignInPage = () => {
  return (
  <div className='h-screen w-full flex items-center justify-center px-4'>
    <AuthForm type='reset-password' />
  </div>
  )
}

export default SignInPage

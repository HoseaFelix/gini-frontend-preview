import AuthForm from '@/components/homepage components/authForm'
import React from 'react'

const SignInPage = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <AuthForm type='sign-in' />
    </div>
  )
}

export default SignInPage

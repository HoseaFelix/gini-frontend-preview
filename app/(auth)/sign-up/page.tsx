import AuthForm from '@/components/authForm'
import React from 'react'

const SignUpPage = () => {
  return (
  <div className='h-screen w-full flex items-center justify-center px-4 py-10'>
    <AuthForm type='signup' />
  </div>
  )
}

export default SignUpPage

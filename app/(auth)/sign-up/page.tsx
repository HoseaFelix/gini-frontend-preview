import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignUpPage = () => {
  return (
  <div className='h-screen w-full flex items-center justify-center'>
    <AuthForm type='sign-up' />
  </div>
  )
}

export default SignUpPage

import React, {ReactNode} from 'react'

const AuthLayout = async ({children}: {children: ReactNode}) => {
 
  
    return (
      <div className='root-layout'>
        
        {children}
      </div>
    )
  }
  
  export default AuthLayout
  
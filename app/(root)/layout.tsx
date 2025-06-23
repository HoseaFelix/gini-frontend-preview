import React, {ReactNode} from 'react'

const RootLayout = async ({children}: {children: ReactNode}) => {
 
  
    return (
      <div className='root-layout'>
        
        {children}
      </div>
    )
  }
  
  export default RootLayout
  
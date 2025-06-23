import React, {ReactNode} from 'react'

const DashboardLayout = async ({children}: {children: ReactNode}) => {
 
  
    return (
      <div className='root-layout'>
        
        {children}
      </div>
    )
  }
  
  export default DashboardLayout
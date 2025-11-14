import React from 'react'

const Pricing = () => {
  return (
    <section className='h-[200dvh] max-sm:pb-20 md:h-[80dvh] w-full pt-20 px-4 md:pb-20 md:px-10 2xl:px-20 bg-white'>
        <h2 className='font-bold text-xl w-fit mx-auto'>Pricing</h2>

        <div className='flex flex-col md:flex-row h-full w-full gap-10 pt-10 justify-center items-center'>

            <div className='flex-1 w-full rounded-lg shadow-sm shadow-black/50 bg-[#D5E0F6] border-1 border-[#295fcc] pt-10 md:h-[70%] '>
                <p className='font-bold text-lg mx-auto w-fit'>Free</p>
                <div className='max-w-[70%] mx-auto h-max'>
                    <p className='italic w-max mx-auto'>Basic features like</p>
                    <ul className=' list-outside pl-5 list-disc font-bold mt-5 flex flex-col gap-2'>
                        <li>Resume builder</li>
                        <li>Upload & export</li>
                        <li>Job application assistant with limited access</li>
                        
                    </ul>

                </div>
        
            </div>
            <div className='flex-1 w-full rounded-lg shadow-sm shadow-black/50 bg-[#80A2E5] border-1 border-[#295fcc] pt-10 md:h-[100%]  '>
                <p className='font-bold text-lg mx-auto w-fit'>Pro</p>
                <p className='font-bold text-lg mx-auto w-fit mt-2'>$19.99</p>
                <div className='max-w-[70%] mx-auto h-max'>
                     <p className='italic w-full  mx-auto'>Full access: BAsic features plus</p>
                    <ul className=' list-outside pl-5 list-disc font-bold mt-5 flex flex-col gap-2 '>
                        <li>Resume analysis</li>
                        <li>Job application tracking</li>
                        <li>Interview assistance</li>
                        <li>Real-time help, and more</li>
                        
                    </ul>

                </div>
        
            </div>
            <div className='flex-1 w-full rounded-lg shadow-sm shadow-black/50 bg-[#D5E0F6] border-1 border-[#295fcc] pt-10 md:h-[70%]'>
                <p className='font-bold text-lg mx-auto w-fit'>Premium</p>
                <p className='font-bold text-lg mx-auto w-fit mt-2
                '>$49.99</p>
                <div className='max-w-[70%] mx-auto h-max'>
                     <p className='italic w-max mx-auto'>All pro features plus</p>
                    <ul className=' list-outside pl-5 list-disc font-bold mt-5 flex flex-col gap-2'>
                        
                        <li>Priority support</li>
                        <li>Access to advanced features</li>
                        <li>Unlimited resume uploads</li>
                        
                    </ul>

                </div>
        
            </div>
            

        </div>
       



    </section>
  )
}

export default Pricing

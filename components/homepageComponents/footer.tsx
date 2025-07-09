import React from 'react'

const Footer = () => {
  return (
    <section className='w-full h-[40vh] md:h-[30vh] bg-foreground text-white  flex flex-col ' >
        <div className='flex flex-col h-fit px-4 md:px-10 py-4'>
            <h2 className='font-bold text-2xl'>AideGini</h2>
            <ul className='flex gap-1 mt-2 '>
                <li>Build</li>
                <li className='list-disc list-inside '>Optimize</li>
                <li className='list-disc list-inside '>Track</li>

            </ul>

        </div>

        <div className='w-full flex flex-col h-fit px-4 md:px-10 text-sm mt-5 mb-5 gap-2 md:flex-row '>
            <div className='flex w-full gap-2 md:items-end'>
                <p className='w-fit hover:cursor-pointer'>Terms of service</p>
                <p className='w-fit hover:cursor-pointer'>Privacy policy</p>
                <p className='w-fit hover:cursor-pointer'>FAQs</p>
                <p className='w-fit hover:cursor-pointer'>Support Center</p>

            </div>
            <div className='flex flex-col w-fit text-sm mt-3 gap-2'>
                <div className='font-bold'>Contact us :</div>
                <div className='flex gap-2'>
                    <p className='w-fit hover:cursor-pointer'>Email</p>
                    <p className='w-fit hover:cursor-pointer'>Twitter</p>
                    <p className='w-fit hover:cursor-pointer'>Facebook</p>
                    <p className='w-fit hover:cursor-pointer'>LinkedIn</p>

                </div>

            </div>

           

        </div>

        <div className='w-full border-t-1 flex items-center justify-center text-sm h-full mt-5'>
            <div className='flex gap-2 w-fit'>
                <p className='w-fit'>
                    Copyright 2025
                </p>
                <p className='w-fit'>Aidegini</p>

            </div>

        </div>

    </section>
  )
}

export default Footer

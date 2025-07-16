import Image from 'next/image'
import React from 'react'

const DashSideNavbar = () => {

  const dashNavItem = [
    {
      name: "Dashboard",
      icon: '/icons/Dashboardicon.png',
      href: '/dashboard'
    },
    {
      name: "Resume Manager",
      icon: '/icons/Resumemanagericon.png',
      href: '/resumeManager'
    },
    {
      name: "Cover Letter Generator",
      icon: '/icons/covericon.png',
      href: '/coverLetterGenerator'
    },
    {
      name: "Application Assistant",
      icon: '/icons/Applicationassistanticon.png',
      href: '/applicationAssistant'
    },
    {
      name: "Interview Assistant",
      icon: '/icons/Interviewassistanticon.png',
      href: '/interviewAssistant'
    },
    {
      name: "Presentation Assistant",
      icon: '/icons/Presentationassistanticon.png',
      href: '/presentationAssistant'
    },
    {
      name: "Exam Assistant",
      icon: '/icons/Examassistanticon.png',
      href: '/examAssistant'
    },
    {
      name: "LinkedIn Optimizer",
      icon: '/icons/Linkedinoptimizericon.png',
      href: '/LinkedinOptimizer'
    },
  ]

  return (
    <div className='fixed h-screen hidden md:block top-0 left-0 w-[300px] z-90  bg-foreground pt-5'>

      <p className='mx-auto w-fit text-white font-bold text-3xl hover:cursor-pointer'>AideGini</p>

      <div className='w-max h-fit flex flex-col mx-auto gap-10 text-white pt-10'>
        {dashNavItem.map((item, index)=>(
          <div 
              className={`group hover:cursor-pointer hover:bg-white hover:text-black rounded-lg px-4 py-3 w-fit flex flex-nowrap gap-2 items-center justify-center  `}
              key={index}>
                <Image
                  width={20}
                  height={20}
                  src={item.icon}
                  alt={`${item.name}icon`}
                  className={`${item.name == 'Dashboard' ? 'invert' : ''} group-hover:invert `}
                />

                <p className='font-bold text-sm'>{item.name}</p>


          </div>
        ))}

      </div>
      
    </div>
  )
}

export default DashSideNavbar

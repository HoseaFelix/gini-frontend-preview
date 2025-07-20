import { useAuthStore } from '@/store/store'
import Image from 'next/image'
import React, { useState } from 'react'

const DashSideNavbar = () => {

  const user = useAuthStore.getState().user;

  

  const [isOpen, setIsOpen] = useState(false)
  
  const toggleNav = ()=>{
    setIsOpen((prev) => !prev)
  }

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
    <>
    
    <nav className='z-100 fixed top-0 left-0 w-screen h-[80px] bg-foreground flex text-white'>
        <div className='max-lg:pl-4 lg:w-[300px] lg:flex-shrink-0 flex items-center justify-center text-white font-bold text-xl md:text-2xl lg:text-4xl hover:cursor-pointer '>AideGini</div>



        <div className='flex-1 h-full items-center justify-end lg:justify-between flex px-4'>
            <p className='font bold hidden lg:block'>Welcome {user?.firstName}</p>

            <div className='w-fit gap-5 flex items-center'>
                <div className='py-1 font-bold px-1.5 bg-white rounded text-text'>
                    Free
                </div>
                <div className=' items-center bg-white py-1.5 px-2 rounded'>
                    <Image
                        width={18}
                        height={21}
                        src='/icons/notificationicon.png'
                        alt='notification icon'
                        className=''
                    />
                </div>

                <div className='flex gap-2 items-center hover:cursor-pointer'>
                    <Image
                        width={22}
                        height={22}
                        alt='profile icon'
                        src='/icons/profileicon.png'
                    />
                    <p className='font-bold'>{user?.firstName}</p>

                </div>

                <div className='h-[44px] w-[44px] flex flex-center hover:cursor-pointer lg:hidden' 
                onClick={toggleNav}
                >
                <Image
                    width={24}
                    height={24}
                    alt='hamburger menu'
                    src={isOpen ? '/icons/close.png' : '/icons/hamburger.png'}
                    className='invert'
                />

              </div>


            </div>

        

        </div>
      
    </nav>
    <div className={`fixed h-screen ${isOpen ? 'w-[70vw] md:w-[300px]' : 'hidden w-0'}  lg:block top-0 left-0 lg:w-[300px] z-90  bg-foreground pt-10 px-5 overflow-hidden  `}>

      <div className='w-full h-fit flex flex-col mx-auto gap-5 text-white pt-10'>
        {dashNavItem.map((item, index)=>(
          <div 
              className={`group hover:cursor-pointer hover:bg-white hover:text-black rounded-lg px-4 py-3 w-full flex flex-nowrap gap-2 items-center  `}
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

      <div className='absolute left-5 right-5 h-[50px] bottom-10  '>
        <div className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div className='w-fit h-fit flex'>
              <Image
                src='/icons/settings.png'
                alt='settings icon'
                width={20}
                height={20}

              />
            </div>
            <div className='w-fit text-white font-bold'>
                Settings

              </div>

          </div>

          <div className='p-2 h-fit bg-white rounded-lg flex items-center hover:cursor-pointer'>
            <Image
              src='/icons/question.png'
              height={15}
              width={15}
              alt='question icon'
            />

          </div>

        </div>

      </div>
      
    </div>
    </>
    
  )
}

export default DashSideNavbar

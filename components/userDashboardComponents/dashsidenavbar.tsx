'use client'
import { useAuthStore, useCurrentNav } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const DashSideNavbar = () => {
  

  const router = useRouter();

  const user = useAuthStore.getState().user;

  

  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationOpen, setNotificationOpen] = useState(false)
  const [currentNav, setCurrentNav] = useState("")
  
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

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      useAuthStore.getState().logout();
      toast('logged out successfully')
      router.push('/sign-in')
      
    }
  };

  const handleNotificationToggle = ()=>{
    setNotificationOpen((prev)=> !prev)
  }

  const notifications = [
    {name:' dummy1', time: '30 mins ago '},
    {name:' dummy2', time: '30 mins ago '},
  ]

  const setCurrentNavbar = useCurrentNav((state) => state.setCurrentNav);

  const handleNavSwitch = (nav : string)=>{

     setCurrentNavbar(nav);
     setCurrentNav(useCurrentNav.getState().currentNav)
     router.push(`${nav.toLowerCase().split(' ').join("")}`)
     
  }

  useEffect(()=>{
    setCurrentNav(useCurrentNav.getState().currentNav)
  },[])

  return (
    <>
    
    <nav className='z-100 fixed top-0 left-0 w-screen h-[80px] bg-foreground flex text-white'>
        <div className='max-lg:pl-4 lg:w-[300px] lg:flex-shrink-0 flex items-center justify-center text-white font-bold text-xl md:text-2xl lg:text-4xl hover:cursor-pointer '>AideGini</div>



        <div className='flex-1 h-full items-center justify-end lg:justify-between flex px-5'>
            <p className='font bold hidden lg:block'>Welcome {user?.firstName}</p>

            <div className='w-fit gap-5 flex items-center'>
                <div className='py-1 font-bold px-1.5 bg-white rounded text-text'>
                    Free
                </div>
                <div 
                onClick={handleNotificationToggle} className=' hover:cursor-pointer notification items-center bg-white py-1.5 px-2 rounded'>
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
                    <p className='font-bold hidden md:block'>{user?.firstName}</p>

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

      <div className='w-full h-full pb-5 flex justify-between flex-col mx-auto gap-5 text-white pt-10'>
        <div className='flex flex-col gap-1 md:gap-5'>
          {dashNavItem.map((item, index)=>(
            <div 

                onClick={()=>{handleNavSwitch(item.name)}}
                className={`group hover:cursor-pointer ${currentNav == item.name? 'bg-white text-black' : ''} hover:bg-white/50 hover:text-black rounded-lg px-4 py-3 w-full flex flex-nowrap gap-2 items-center  `}
                key={index}>
                  <Image
                    width={20}
                    height={20}
                    src={item.icon}
                    alt={`${item.name}icon`}
                    className={`${currentNav == item.name ? 'invert' : ''} group-hover:invert `}
                  />

                  <p className='font-bold text-sm'>{item.name}</p>


            </div>
          ))}
        </div>
        
        <div className='flex flex-col gap-5'>
            <div className='  h-[50px]  '>
            <div className='w-full h-full flex justify-between items-center'>
              <div className=' hover:cursor-pointer flex items-center gap-2'>
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
            <div 
              onClick={handleLogout}
              className=' h-fit  w-fit'>
                <div className='py-3 px-4 hover:cursor-pointer text-sm font-bold bg-white rounded-lg text-foreground'>
                  Log Out

                </div>

      </div>


        </div>

      </div>

      

      
      
    </div>


    <div className={`notifications-panel fixed top-0 right-0 bottom-0 ${!isNotificationOpen ? 'hidden' : 'w-[70dvw] md:w-[50dvw] ' } bg-foreground z-100 shadow-xl shadow-black overflow-hidden transition-all`}>

      <div className='w-full h-full py-10 px-4  flex flex-col gap-5'>
        <div className='flex text-white justify-between w-full items-center h-fit'>
          <p className='font-bold text-2xl'>Notifications</p>
          <Image
            src='/icons/close.png'
            alt='close icon'
            width={20}
            height={20}
            className='invert hover:cursor-pointer'
            onClick={handleNotificationToggle}
          />

        </div>

        {notifications.length > 0 && (
          notifications.map((notification, index)=>(
            <div className='w-full h-fit p-2 bg-white shadow-sm rounded-xl flex flex-col justify-between gap-5' key={index}>
              <p className=''>{notification.name}</p>
              <p className='opacity-50 text-sm'>{notification.time}</p>

            </div>
          ))
        )}

        <div className='w-full flex h-fit items-end justify-end'>
          <Link href='' className='underline text-white hover:cursor-pointer text-sm'>Load more</Link>

        </div>


      </div>




    </div>     

    </>
    
  )
}

export default DashSideNavbar

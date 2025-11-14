'use client';

import DashSideNavbar from '@/components/userDashboardComponents/dashsidenavbar';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/store';
import { toast } from 'sonner';

// import TopBar from '@/components/userDashboardComponents/topbar';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const {token, setUser } = useAuthStore();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {

      console.log('checking auth')

      const savedAuth =JSON.parse(localStorage.getItem('auth') || sessionStorage.getItem('auth') || 'null');
    
    if (savedAuth) {
      useAuthStore.setState({
        user: savedAuth.user,
        token: savedAuth.token,
        remember: savedAuth.remember,
      });
      setIsAuth(true)
    } else{
        try {
          let res;
          
  
          if (token) {
            res = await fetch('https://aidgeny.onrender.com/api/auth/session', {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            res = await fetch('https://aidgeny.onrender.com/api/auth/session', {
              credentials: 'include',
            });
          }
  
          if (!res.ok) throw new Error('Unauthorized');
  
          const user = await res.json();
          const remember = false
          setUser(user.user, user.token, remember);
          setIsAuth(true);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Something went wrong';
          toast.error(errorMessage);
          setIsAuth(false);
        }

      }
    
    };

    checkAuth();
  }, [token, setUser]);

  useEffect(() => {
    if (isAuth === false) {
      toast.error('Unauthorized access, redirecting to sign in...');
      router.push('/sign-in');
    }
  }, [isAuth, router]);

  if (isAuth === null) {
    return <p className="text-center py-20">Checking authentication...</p>;
  }

  if (!isAuth) {
    return null; 
  }

  return <div className="root-layout pl-4 pr-4 md:pl-10 md:pr-10 lg:pl-[350px] pt-30 relative">

          
              
              <DashSideNavbar/>
              {/* <TopBar/> */}
              {children}
              
          </div>;
};

export default RootLayout;

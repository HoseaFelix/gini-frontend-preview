'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/store';
import { toast } from 'sonner';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { token, setUser } = useAuthStore();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {

      console.log('checking auth')
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
        setUser(user.id, token || '');
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
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
    return null; // or a spinner if you want, while redirecting
  }

  return <div className="root-layout">{children}</div>;
};

export default DashboardLayout;

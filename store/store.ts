import { create } from 'zustand';

type AuthState = {
  user: { id: number; firstName: string; email: string } | null;
  token: string | null;
  remember: boolean;
  setUser: (
    user: { id: number; firstName: string; email: string },
    token: string,
    remember: boolean
  ) => void;
  logout: () => void;
};

// Helper function to persist auth state
const saveAuthState = (
  user: { id: number; firstName: string; email: string },
  token: string,
  remember: boolean
) => {
  const data = JSON.stringify({ user, token, remember });

  if (remember) {
    localStorage.setItem('auth', data);
    sessionStorage.removeItem('auth'); // clean up
  } else {
    sessionStorage.setItem('auth', data);
    localStorage.removeItem('auth'); // clean up
  }
};

const clearAuthState = () => {
  localStorage.removeItem('auth');
  sessionStorage.removeItem('auth');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  remember: false,

  setUser: (user, token, remember) => {
    set({ user, token, remember });
    saveAuthState(user, token, remember);
  },

  logout: () => {
    set({ user: null, token: null, remember: false });
    clearAuthState();
  },
}));

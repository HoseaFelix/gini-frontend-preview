/**
 * @file Global state management for authentication and navigation using Zustand
 * Handles user authentication, token persistence, and current page tracking
 */

import { create } from 'zustand';

/**
 * Type definition for Authentication state
 * @type {AuthState}
 */
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

/**
 * Persists authentication state to localStorage or sessionStorage
 * @param {object} user - User object with id, firstName, email
 * @param {string} token - Authentication token from backend
 * @param {boolean} remember - If true, persist to localStorage; otherwise use sessionStorage
 */
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

/**
 * Clears all authentication state from storage
 * Used during logout
 */
const clearAuthState = () => {
  localStorage.removeItem('auth');
  sessionStorage.removeItem('auth');
};

/**
 * Type definition for current navigation state
 * @type {currentNav}
 */
type currentNav = {
  currentNav: string;
  setCurrentNav: (url: string) => void;
};

/**
 * useCurrentNav - Tracks which page/section user is currently viewing
 * Used by navbar and sidebar to highlight active section
 * 
 * Usage:
 * - Get: useCurrentNav.getState().currentNav
 * - Set: useCurrentNav.getState().setCurrentNav('Resume Manager')
 * - In component: const { currentNav, setCurrentNav } = useCurrentNav()
 */
export const useCurrentNav = create<currentNav>((set) => ({
  currentNav: "Dashboard",
  setCurrentNav: (current: string) => {
    set({ currentNav: current });
  },
}));

/**
 * useAuthStore - Manages user authentication state and token
 * Persists to localStorage or sessionStorage based on "Remember Me" preference
 * 
 * Usage:
 * - Get token: useAuthStore.getState().token
 * - Set user: useAuthStore.getState().setUser(userData, token, rememberMe)
 * - Logout: useAuthStore.getState().logout()
 * - In component: const { user, token, setUser, logout } = useAuthStore()
 */
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

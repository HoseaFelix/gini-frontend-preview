import {create} from 'zustand'

type AuthState = {
    userId: string | null;
    token: string | null;
    setUser: (userId: string, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set)=>({
    userId: null,
    token: null,
    setUser: (userId, token) => set({userId, token}),
    logout: ()=> set({userId: null, token:null})

}))
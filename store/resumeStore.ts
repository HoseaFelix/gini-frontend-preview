// store/resumeStore.ts
import { ResumeType } from '@/lib/schemes/resumeSchema';
import { create } from 'zustand';


type ResumeStore = {
  parsedResume: ResumeType | null;
  setParsedResume: (data: ResumeType) => void;
  clearParsedResume: () => void;
};

//first store for the imported resume
export const useResumeStore = create<ResumeStore>((set) => ({
  parsedResume: null,
  setParsedResume: (data) => set({ parsedResume: data }),
  clearParsedResume: () => set({ parsedResume: null }),
}));

//store for the optimized resume
export const useOptimizedStore = create<ResumeStore>((set)=>({
  parsedResume:null,
  setParsedResume: (data)=> set({parsedResume: data}),
  clearParsedResume: ()=> set({parsedResume: null}),
}))
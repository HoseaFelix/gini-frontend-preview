// store/resumeStore.ts
/**
 * @file Global state management for resume data using Zustand
 * Manages both the initial parsed resume and the AI-optimized version
 */

import { ResumeType } from '@/lib/schemes/resumeSchema';
import { create } from 'zustand';

/**
 * Type definition for the Resume store state and actions
 */
type ResumeStore = {
  parsedResume: ResumeType | null;
  setParsedResume: (data: ResumeType) => void;
  clearParsedResume: () => void;
};

/**
 * useResumeStore - Stores the initially parsed resume from uploaded file or manually entered data
 * This is used throughout the app to access the original/working resume state
 * 
 * Usage:
 * - Get: useResumeStore.getState().parsedResume
 * - Set: useResumeStore.getState().setParsedResume(resumeData)
 * - In component: const { parsedResume, setParsedResume } = useResumeStore()
 */
export const useResumeStore = create<ResumeStore>((set) => ({
  parsedResume: null,
  setParsedResume: (data) => set({ parsedResume: data }),
  clearParsedResume: () => set({ parsedResume: null }),
}));

/**
 * useOptimizedStore - Stores the AI-optimized resume after optimization with job description
 * This allows comparison between original and optimized versions
 * 
 * Usage:
 * - Get: useOptimizedStore.getState().parsedResume
 * - Set: useOptimizedStore.getState().setParsedResume(optimizedResumeData)
 * - In component: const { parsedResume: optimizedResume } = useOptimizedStore()
 */
export const useOptimizedStore = create<ResumeStore>((set) => ({
  parsedResume: null,
  setParsedResume: (data) => set({ parsedResume: data }),
  clearParsedResume: () => set({ parsedResume: null }),
}));
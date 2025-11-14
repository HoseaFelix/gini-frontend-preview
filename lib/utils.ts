import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const setRememberMe = (value: boolean) => {
  localStorage.setItem("rememberMe", JSON.stringify(value));
};

export const getRememberMe = (): boolean => {
  const value = localStorage.getItem("rememberMe");
  return value ? JSON.parse(value) : false;
};
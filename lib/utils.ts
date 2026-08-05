import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditional class merging (marzi-web house pattern). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

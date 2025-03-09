import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges classes and resolves conflicts for TailwindCSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

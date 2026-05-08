import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn — composes Tailwind class names with intelligent merging.
 * Used by every shadcn/ui component so variant classes can be overridden cleanly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

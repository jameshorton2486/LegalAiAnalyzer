import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes URLs by removing duplicate slashes
 * Use this function to prevent invalid href errors with double slashes
 */
export function sanitizeUrl(url: string): string {
  // Step 1: Handle protocol correctly
  let sanitized = url;
  
  // Step 2: If URL starts with '/', ensure there are no duplicates
  if (sanitized.startsWith('/')) {
    // Remove the first slash to handle it separately
    const withoutFirstSlash = sanitized.substring(1);
    // Remove any leading slashes from the remainder
    const cleanRemainder = withoutFirstSlash.replace(/^\/+/, '');
    // Put back the single leading slash
    sanitized = '/' + cleanRemainder;
  }
  
  // Step 3: Fix any remaining duplicate slashes
  sanitized = sanitized.replace(/([^:]\/)\/+/g, '$1');
  
  return sanitized;
}

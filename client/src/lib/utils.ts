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
  // Remove duplicate slashes (except after protocol like http://)
  return url.replace(/([^:]\/)\/+/g, "$1");
}

import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns boolean - true if valid, false otherwise
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Handle blob URLs (for file uploads)
  if (url.startsWith('blob:')) {
    return true;
  }

  // Handle data URLs (for base64 encoded images)
  if (url.startsWith('data:')) {
    return true;
  }

  // Handle relative URLs
  if (url.startsWith('/')) {
    return true;
  }

  // Handle absolute URLs
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols for security
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns a valid URL or null if the URL is invalid
 * @param url - The URL string to validate and clean
 * @returns string | null - the valid URL or null if invalid
 */
export function getValidUrl(url: string | null | undefined): string | null {
  if (!isValidUrl(url)) {
    return null;
  }
  return url!;
}

/**
 * Formats an array of site names into a grammatically correct string
 * @param siteNames - Array of site names to format
 * @returns string - Formatted string (e.g., "Site A", "Site A and Site B", "Site A, Site B, and Site C")
 */
export function formatSiteNames(siteNames: string[]): string {
  if (siteNames.length === 0) return '';
  if (siteNames.length === 1) return siteNames[0];
  if (siteNames.length === 2) return siteNames.join(' and ');

  // For 3+ items, join with commas and "and" before the last item
  const allButLast = siteNames.slice(0, -1).join(', ');
  const last = siteNames[siteNames.length - 1];
  return `${allButLast}, and ${last}`;
}

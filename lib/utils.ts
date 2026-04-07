import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeFilename(filename: string): string {
  const parts = filename.split('.');
  const ext = parts.pop() || '';
  const baseName = parts.join('.') || 'file';
  
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word (except space/hyphen)
    .trim()                   // Trim whitespace before replacing with hyphens
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens

  return `${sanitized || 'file'}.${ext}`;
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number) {
  try {
    const d = new Date(date)
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return ''
    }
  
  // If the date is from today, show the time
    if (isToday(d)) {
    return format(d, "h:mm a")
  }
  
    // If the date is from yesterday, show "Yesterday"
    if (isYesterday(d)) {
      return "Yesterday"
    }

    // If the date is from this year, show the month and day
    if (d.getFullYear() === new Date().getFullYear()) {
      return format(d, "MMM d")
  }
  
  // Otherwise show the full date
  return format(d, "MMM d, yyyy")
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  // ... implementation
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str
}
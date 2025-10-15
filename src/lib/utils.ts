import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getAuthorityColor(authority: string): string {
  switch (authority) {
    case 'OFFICIAL':
      return 'badge-official'
    case 'SCHOLARLY':
      return 'badge-scholarly'
    case 'PRESS':
      return 'badge-press'
    case 'CLAIM':
      return 'badge-claim'
    case 'COMMUNITY':
      return 'badge-community'
    default:
      return 'bg-muted text-white'
  }
}

export function getAuthorityIcon(authority: string): string {
  switch (authority) {
    case 'OFFICIAL':
      return '🏛️'
    case 'SCHOLARLY':
      return '📚'
    case 'PRESS':
      return '📰'
    case 'CLAIM':
      return '⚠️'
    case 'COMMUNITY':
      return '👥'
    default:
      return '📄'
  }
}

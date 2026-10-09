import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/30";
  return "text-rose-500 bg-rose-500/10 border-rose-500/30";
}

export function getSeverityBadge(severity: string): string {
  switch (severity) {
    case 'critical':
      return "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse";
    case 'high':
      return "bg-rose-500/20 text-rose-400 border-rose-500/40";
    case 'medium':
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case 'low':
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
  }
}

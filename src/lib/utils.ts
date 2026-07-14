import { type ClassValue, clsx } from "clsx";

// Simple clsx implementation (no tailwind-merge needed for v4)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Format date to Vietnamese locale
export function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

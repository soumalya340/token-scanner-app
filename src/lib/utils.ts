import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const message = "message" in error ? String(error.message) : "";
  return message === "Unauthorized" || message.includes("Unauthorized");
}

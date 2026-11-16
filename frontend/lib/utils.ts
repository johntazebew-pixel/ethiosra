// ============================================================================
// File Name: utils.ts
// Exact Location: frontend/lib/utils.ts
// Description: Common helper utilities for formatting, strings, dates, and media.
// ============================================================================

/**
 * Combines conditional class names cleanly
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats salary ranges in ETB currency or displays 'Negotiable'
 */
export function formatSalary(
  salaryMin?: number | null,
  salaryMax?: number | null,
  isNegotiable?: boolean
): string {
  if (isNegotiable && !salaryMin && !salaryMax) {
    return "Negotiable";
  }

  if (salaryMin && salaryMax) {
    return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} ETB`;
  }

  if (salaryMin && !salaryMax) {
    return `From ${salaryMin.toLocaleString()} ETB`;
  }

  if (!salaryMin && salaryMax) {
    return `Up to ${salaryMax.toLocaleString()} ETB`;
  }

  return "Negotiable";
}

/**
 * Formats ISO date string into readable Ethiopian standard format (e.g. 'Oct 24, 2026')
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "N/A";
  }
}

/**
 * Computes initials from a person or company name (e.g. 'Ethio Telecom' -> 'ET')
 */
export function getInitials(name?: string | null): string {
  if (!name) return "ES";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Resolves an image URL: handles relative backend uploads like /uploads/...,
 * absolute URLs, data URLs, and returns an empty string if null.
 */
export function resolveImageUrl(url?: string | null): string {
  const imageUrl = url?.trim();
  if (!imageUrl) return "";
  if (/^(https?:|data:|blob:)/i.test(imageUrl)) {
    return imageUrl;
  }
  if (imageUrl.startsWith("//")) {
    return `https:${imageUrl}`;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333").replace(/\/+$/, "");
  return `${backendBase}/${imageUrl.replace(/^\/+/, "")}`;
}

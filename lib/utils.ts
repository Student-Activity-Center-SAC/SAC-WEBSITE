import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function domainLabel(domain: string) {
  const map: Record<string, string> = {
    TEC: 'Technical', CUL: 'Cultural', SPO: 'Sports',
    SOC: 'Social', ART: 'Arts', LIT: 'Literary',
  };
  return map[domain] ?? domain;
}

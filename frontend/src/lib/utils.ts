import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format numbers with proper decimals
export function formatNumber(num: number | undefined | null, decimals = 1): string {
  if (num === undefined || num === null) return '-';
  return num.toFixed(decimals);
}

// Format percentages
export function formatPercentage(num: number | undefined | null, decimals = 1): string {
  if (num === undefined || num === null) return '-';
  return `${(num * 100).toFixed(decimals)}%`;
}

// Format player name
export function formatPlayerName(firstName: string, lastName: string, short = false): string {
  if (short) {
    return `${firstName.charAt(0)}. ${lastName}`;
  }
  return `${firstName} ${lastName}`;
}

// Format position
export function formatPosition(position: string): string {
  const positions: Record<string, string> = {
    PG: 'Point Guard',
    SG: 'Shooting Guard',
    SF: 'Small Forward',
    PF: 'Power Forward',
    C: 'Center',
  };
  return positions[position] || position;
}

// Format height (cm to feet-inches)
export function formatHeight(cm: number | undefined | null): string {
  if (!cm) return '-';
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

// Format weight (kg to lbs)
export function formatWeight(kg: number | undefined | null): string {
  if (!kg) return '-';
  const lbs = Math.round(kg * 2.20462);
  return `${lbs} lbs`;
}

// Format date
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Calculate age from birthdate
export function calculateAge(birthDate: string | Date | undefined | null): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Get stat color based on value (for visual indicators)
export function getStatColor(value: number, thresholds: { good: number; average: number }): string {
  if (value >= thresholds.good) return 'text-green-600';
  if (value >= thresholds.average) return 'text-yellow-600';
  return 'text-red-600';
}

// Get efficiency color
export function getEfficiencyColor(efficiency: number): string {
  if (efficiency >= 20) return 'bg-green-500';
  if (efficiency >= 15) return 'bg-blue-500';
  if (efficiency >= 10) return 'bg-yellow-500';
  return 'bg-red-500';
}

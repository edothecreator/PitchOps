import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatShortDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatKickoffTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatFullDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Today's date as YYYY-MM-DD string. */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Determine if a fixture is currently live. */
export function isLiveStatus(short: string): boolean {
  return ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT'].includes(short);
}

/** Determine if a fixture is finished. */
export function isFinishedStatus(short: string): boolean {
  return ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(short);
}

/** Determine if a fixture is upcoming. */
export function isUpcomingStatus(short: string): boolean {
  return ['NS', 'TBD', 'PST'].includes(short);
}

/** Convert a form string like "WWDLW" to an array of result codes. */
export function parseForm(form: string): Array<'W' | 'D' | 'L'> {
  return form.split('').filter((c): c is 'W' | 'D' | 'L' =>
    ['W', 'D', 'L'].includes(c)
  );
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

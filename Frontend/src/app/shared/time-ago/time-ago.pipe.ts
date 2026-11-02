import { Pipe, PipeTransform } from '@angular/core';

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// The backend stores UTC but serializes without a "Z", so treat offset-less dates as UTC.
export function parseApiDate(value: string): Date {
  const hasOffset = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value);
  return new Date(hasOffset ? value : `${value}Z`);
}

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    const date = parseApiDate(value);
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

    if (seconds < MINUTE) {
      return 'Just now';
    }
    if (seconds < HOUR) {
      return plural(Math.floor(seconds / MINUTE), 'minute');
    }
    if (seconds < DAY) {
      return plural(Math.floor(seconds / HOUR), 'hour');
    }
    if (seconds < 2 * DAY) {
      return 'Yesterday';
    }
    if (seconds < 7 * DAY) {
      return plural(Math.floor(seconds / DAY), 'day');
    }

    const sameYear = date.getFullYear() === new Date().getFullYear();
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: sameYear ? undefined : 'numeric' });
  }
}

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
}

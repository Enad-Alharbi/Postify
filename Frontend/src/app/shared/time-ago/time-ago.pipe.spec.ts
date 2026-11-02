import { TimeAgoPipe, parseApiDate } from './time-ago.pipe';

// The API serializes UTC dates without a "Z".
function apiDateSecondsAgo(seconds: number): string {
  return new Date(Date.now() - seconds * 1000).toISOString().replace('Z', '');
}

describe('parseApiDate', () => {
  it('treats dates without an offset as UTC', () => {
    expect(parseApiDate('2026-01-01T10:00:00').toISOString()).toBe('2026-01-01T10:00:00.000Z');
  });

  it('keeps an explicit offset', () => {
    expect(parseApiDate('2026-01-01T10:00:00+02:00').toISOString()).toBe('2026-01-01T08:00:00.000Z');
  });
});

describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();

  it('formats recent times', () => {
    expect(pipe.transform(apiDateSecondsAgo(10))).toBe('Just now');
    expect(pipe.transform(apiDateSecondsAgo(60))).toBe('1 minute ago');
    expect(pipe.transform(apiDateSecondsAgo(5 * 60))).toBe('5 minutes ago');
    expect(pipe.transform(apiDateSecondsAgo(3 * 3600))).toBe('3 hours ago');
    expect(pipe.transform(apiDateSecondsAgo(30 * 3600))).toBe('Yesterday');
    expect(pipe.transform(apiDateSecondsAgo(3 * 86400))).toBe('3 days ago');
  });
});

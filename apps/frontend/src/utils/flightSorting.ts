/**
 * Robust parser for flight departure/arrival time strings.
 * Handles "15:55", "1555", "8:40 AM", "11:15 PM", "0840", "840", etc.
 * Returns minutes from midnight (0 to 1439).
 */
export function parseFlightTimeMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const t = String(timeStr).trim().toUpperCase();
  const isPM = t.includes('PM') || t.includes('P.M.');
  const isAM = t.includes('AM') || t.includes('A.M.');

  if (t.includes(':')) {
    const parts = t.split(':');
    let hours = parseInt(parts[0].replace(/[^0-9]/g, ''), 10) || 0;
    const minutes = parseInt(parts[1].replace(/[^0-9]/g, ''), 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const digits = t.replace(/[^0-9]/g, '');
  if (digits.length === 4) {
    let hours = parseInt(digits.substring(0, 2), 10);
    const minutes = parseInt(digits.substring(2, 4), 10);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  if (digits.length === 3) {
    let hours = parseInt(digits.substring(0, 1), 10);
    const minutes = parseInt(digits.substring(1, 3), 10);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  if (digits.length === 1 || digits.length === 2) {
    let hours = parseInt(digits, 10);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60;
  }
  return 0;
}

/**
 * Normalizes flight date to a calendar day timestamp (midnight UTC)
 * avoiding timezone offset skew.
 */
export function getFlightCalendarTimestamp(d: any): number {
  if (!d) return 0;
  if (typeof d === 'string') {
    const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return Date.UTC(year, month, day);
    }
  }
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return 0;
  return Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
}

/**
 * Sorts flight segments in strict chronological order by calendar flight date
 * and departure time.
 */
export function sortFlightsChronologically<T extends { date?: any; departTime?: string; flightNo?: string }>(
  flights: T[]
): T[] {
  if (!flights || !Array.isArray(flights)) return [];
  return [...flights].sort((a: any, b: any) => {
    // 1. Compare calendar day (UTC)
    const timeA = getFlightCalendarTimestamp(a.date);
    const timeB = getFlightCalendarTimestamp(b.date);

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    // 2. Same calendar day: compare departure time in minutes from midnight
    const minsA = parseFlightTimeMinutes(a.departTime);
    const minsB = parseFlightTimeMinutes(b.departTime);
    if (minsA !== minsB) {
      return minsA - minsB;
    }

    // 3. Tie-breaker: flight number
    return String(a.flightNo || '').localeCompare(String(b.flightNo || ''));
  });
}

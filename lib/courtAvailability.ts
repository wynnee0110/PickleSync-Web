/**
 * Real-Time Availability & Booking Constraints for PickleSync
 * Synchronized with live current date/time and 5-day advance booking window.
 */

// Maximum advance booking limit in days
export const MAX_ADVANCE_DAYS = 5;

// Hours that are 100% fully booked across both courts for specific days
export const FULLY_BOOKED_HOURS_BY_DAY: Record<number, string[]> = {
  9: ['04:00 PM', '07:00 PM'],
  10: ['08:00 AM', '05:00 PM'],
  11: ['11:00 AM', '06:00 PM'],
  12: ['09:00 AM', '04:00 PM'],
  14: ['08:00 AM', '12:00 PM'],
  15: ['05:00 PM', '07:00 PM'],
  16: ['10:00 AM', '06:00 PM'],
  17: ['01:00 PM', '08:00 PM'],
  18: ['03:00 PM', '05:00 PM'],
  19: ['04:00 PM', '07:00 PM'],
};

// Explicit occupied court numbers (1 or 2) by day and time slot
export const OCCUPIED_COURTS_BY_DAY_AND_TIME: Record<number, Record<string, number[]>> = {
  9: {
    '08:00 AM': [2],
    '09:00 AM': [1],
    '10:00 AM': [1],
    '11:00 AM': [2],
    '12:00 PM': [],
    '01:00 PM': [2],
    '02:00 PM': [1],
    '03:00 PM': [2],
    '04:00 PM': [1, 2], // 100% Full
    '05:00 PM': [1],
    '06:00 PM': [2],
    '07:00 PM': [1, 2], // 100% Full
    '08:00 PM': [],
  },
  10: {
    '08:00 AM': [1, 2], // 100% Full
    '09:00 AM': [1],
    '10:00 AM': [2],
    '11:00 AM': [],
    '12:00 PM': [2],
    '01:00 PM': [1],
    '02:00 PM': [],
    '03:00 PM': [2],
    '04:00 PM': [1],
    '05:00 PM': [1, 2], // 100% Full
    '06:00 PM': [2],
    '07:00 PM': [1],
    '08:00 PM': [],
  },
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Returns today's date normalized to midnight local time.
 */
export const getTodayDate = (now: Date = new Date()): Date => {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Formats a Date object into "MMM D, YYYY" (e.g. "Nov 21, 2026").
 */
export const formatCurrentDate = (d: Date = new Date()): string => {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/**
 * Formats a Date object into "MMM D" (e.g. "Nov 21").
 */
export const formatShortDate = (d: Date = new Date()): string => {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
};

/**
 * Generates the active 6-day booking window (Today + 5 advance days)
 * with dynamic date labels, day tags ('Today', 'Tomorrow', 'Wed'), and day numbers.
 */
export const getDynamicScheduleDates = (now: Date = new Date()) => {
  const today = getTodayDate(now);

  return Array.from({ length: MAX_ADVANCE_DAYS + 1 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    const tag = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS_OF_WEEK[d.getDay()];

    return {
      day,
      monthIndex: d.getMonth(),
      year,
      dateLabel: `${month} ${day}, ${year}`,
      shortLabel: `${month} ${day}`,
      tag,
      dateObj: d,
    };
  });
};

/**
 * Check if a calendar date is in the past (yesterday or earlier).
 * Supports (year, month, day) or legacy (day, monthOffset).
 */
export const isDateInPast = (
  dayOrYear: number,
  monthOffsetOrMonth: number = 0,
  dayOptional?: number,
  now: Date = new Date()
): boolean => {
  const today = getTodayDate(now);
  if (dayOptional !== undefined) {
    const target = new Date(dayOrYear, monthOffsetOrMonth, dayOptional);
    return target.getTime() < today.getTime();
  }
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffsetOrMonth, dayOrYear);
  return target.getTime() < today.getTime();
};

/**
 * Check if a calendar date exceeds the 5-day advance booking limit.
 * Supports (year, month, day) or legacy (day, monthOffset).
 */
export const isDateBeyondAdvanceLimit = (
  dayOrYear: number,
  monthOffsetOrMonth: number = 0,
  dayOptional?: number,
  now: Date = new Date()
): boolean => {
  const today = getTodayDate(now);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + MAX_ADVANCE_DAYS);

  let target: Date;
  if (dayOptional !== undefined) {
    target = new Date(dayOrYear, monthOffsetOrMonth, dayOptional);
  } else {
    target = new Date(now.getFullYear(), now.getMonth() + monthOffsetOrMonth, dayOrYear);
  }

  return target.getTime() > maxDate.getTime() || target.getTime() < today.getTime();
};

/**
 * Check if the target year, month, and day matches today's date in local time.
 */
export const isDateToday = (
  year: number,
  month: number,
  day: number,
  now: Date = new Date()
): boolean => {
  const today = getTodayDate(now);
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
};

/**
 * Check if a time slot (e.g. "08:00 AM", "02:00 PM") has already passed in real-time today.
 */
export const isTimeSlotPassedToday = (
  timeString: string,
  isTodayDate: boolean,
  now: Date = new Date()
): boolean => {
  if (!isTodayDate) return false;
  const parts = timeString.trim().split(' ');
  if (parts.length < 2) return false;

  const [time, period] = parts;
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr || '0', 10);

  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  return slotDate.getTime() <= now.getTime();
};

/**
 * Check if a specific calendar date is completely booked (e.g. tournament blackout days).
 * Today and tomorrow are never blackout days.
 */
export const isDateFullyBooked = (day: number): boolean => {
  const today = new Date().getDate();
  if (day === today || day === today + 1) return false;
  return false;
};

/**
 * Check if both courts (1 and 2) are occupied at a given day and hour.
 */
export const isHourFullyOccupied = (
  day: number,
  timeString: string,
  isTodayDate: boolean = false,
  now: Date = new Date()
): boolean => {
  if (isTimeSlotPassedToday(timeString, isTodayDate, now)) return true;
  if (isDateFullyBooked(day)) return true;

  const dayFullHours = FULLY_BOOKED_HOURS_BY_DAY[day];
  if (dayFullHours && dayFullHours.includes(timeString)) {
    return true;
  }

  // Fallback check on occupied count
  const occupiedCourts = getOccupiedCourtsForSlot(day, timeString);
  return occupiedCourts.length >= 2;
};

/**
 * Get the list of occupied court numbers (1-2) for a specific day and time.
 * Generates a realistic deterministic schedule across the 2 courts.
 */
export const getOccupiedCourtsForSlot = (day: number, timeString: string): number[] => {
  if (isDateFullyBooked(day)) {
    return [1, 2];
  }

  // Check explicit mock map first
  const dayMap = OCCUPIED_COURTS_BY_DAY_AND_TIME[day];
  if (dayMap && dayMap[timeString]) {
    return dayMap[timeString];
  }

  // Check if it's marked as fully booked hour
  const dayFullHours = FULLY_BOOKED_HOURS_BY_DAY[day];
  if (dayFullHours && dayFullHours.includes(timeString)) {
    return [1, 2];
  }

  // Deterministic mock pattern for other dates based on day and hour across 2 courts
  const timeHash = timeString.split(':')[0] ? parseInt(timeString.split(':')[0], 10) : 1;
  const isPM = timeString.includes('PM');
  const numericHour = isPM && timeHash !== 12 ? timeHash + 12 : timeHash;

  const mod = (day + numericHour) % 3;
  if (mod === 0) return [1];
  if (mod === 1) return [2];
  return [];
};

/**
 * Check if an individual court is occupied for a given day and hour.
 */
export const isCourtOccupied = (
  courtNumber: number,
  day: number,
  timeString: string,
  isTodayDate: boolean = false,
  now: Date = new Date()
): boolean => {
  if (isTimeSlotPassedToday(timeString, isTodayDate, now)) return true;
  const occupied = getOccupiedCourtsForSlot(day, timeString);
  return occupied.includes(courtNumber);
};

/**
 * Get the count of open (unoccupied & not passed) slots for a court on a given day.
 */
export const getCourtOpenSlotsCount = (
  courtNumber: number,
  day: number,
  slotTimes: string[],
  isTodayDate: boolean = false,
  now: Date = new Date()
): number => {
  if (isDateFullyBooked(day)) return 0;
  return slotTimes.filter(
    (time) =>
      !isCourtOccupied(courtNumber, day, time, false) &&
      !isTimeSlotPassedToday(time, isTodayDate, now)
  ).length;
};

/**
 * Check if a court has zero available slots for a given day.
 */
export const isCourtFullyBookedOnDate = (
  courtNumber: number,
  day: number,
  slotTimes: string[],
  isTodayDate: boolean = false,
  now: Date = new Date()
): boolean => {
  if (isDateFullyBooked(day)) return true;
  return getCourtOpenSlotsCount(courtNumber, day, slotTimes, isTodayDate, now) === 0;
};

/**
 * Find the earliest open time slot for a court on a given day that hasn't passed.
 */
export const getFirstOpenSlotForCourt = (
  courtNumber: number,
  day: number,
  slotTimes: string[],
  isTodayDate: boolean = false,
  now: Date = new Date()
): string | null => {
  if (isDateFullyBooked(day)) return null;
  return (
    slotTimes.find(
      (time) =>
        !isCourtOccupied(courtNumber, day, time, false) &&
        !isTimeSlotPassedToday(time, isTodayDate, now)
    ) || null
  );
};

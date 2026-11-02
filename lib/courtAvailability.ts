/**
 * Mock Availability Data for PickleSync Bookings
 * Simulates real-time occupancy across Dates, Hours, and Courts (Court #1 & Court #2).
 */

// Days of the month that are 100% fully booked (e.g. Saturdays for tournaments)
export const FULLY_BOOKED_DAYS = [6, 13, 20, 27];

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

// Current active day reference (today = Sep 9, matching design mock)
export const TODAY_DAY = 9;

// Maximum advance booking limit in days
export const MAX_ADVANCE_DAYS = 5;

/**
 * Check if a calendar date is in the past (cannot navigate back or select).
 */
export const isDateInPast = (day: number, monthOffset: number): boolean => {
  if (monthOffset < 0) return true;
  if (monthOffset === 0 && day < TODAY_DAY) return true;
  return false;
};

/**
 * Check if a calendar date exceeds the maximum booking advance window (5 days).
 */
export const isDateBeyondAdvanceLimit = (day: number, monthOffset: number): boolean => {
  if (monthOffset < 0) return false;
  if (monthOffset === 0) {
    return day > TODAY_DAY + MAX_ADVANCE_DAYS;
  }
  return true; // Any date in future months exceeds the 5-day window
};

/**
 * Check if a specific calendar date is completely booked.
 */
export const isDateFullyBooked = (day: number): boolean => {
  return FULLY_BOOKED_DAYS.includes(day);
};

/**
 * Check if both courts (1 and 2) are occupied at a given day and hour.
 */
export const isHourFullyOccupied = (day: number, timeString: string): boolean => {
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
export const isCourtOccupied = (courtNumber: number, day: number, timeString: string): boolean => {
  const occupied = getOccupiedCourtsForSlot(day, timeString);
  return occupied.includes(courtNumber);
};

/**
 * Get the count of open (unoccupied) slots for a specific court on a given day.
 */
export const getCourtOpenSlotsCount = (
  courtNumber: number,
  day: number,
  slotTimes: string[]
): number => {
  if (isDateFullyBooked(day)) return 0;
  return slotTimes.filter((time) => !isCourtOccupied(courtNumber, day, time)).length;
};

/**
 * Check if a court has zero available slots for a given day.
 */
export const isCourtFullyBookedOnDate = (
  courtNumber: number,
  day: number,
  slotTimes: string[]
): boolean => {
  if (isDateFullyBooked(day)) return true;
  return getCourtOpenSlotsCount(courtNumber, day, slotTimes) === 0;
};

/**
 * Find the earliest open time slot for a court on a given day.
 */
export const getFirstOpenSlotForCourt = (
  courtNumber: number,
  day: number,
  slotTimes: string[]
): string | null => {
  if (isDateFullyBooked(day)) return null;
  return slotTimes.find((time) => !isCourtOccupied(courtNumber, day, time)) || null;
};

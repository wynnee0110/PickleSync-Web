/**
 * Mock Availability Data for PickleSync Bookings
 * Simulates real-time occupancy across Dates, Hours, and Courts.
 */

// Days of the month that are 100% fully booked (e.g. Saturdays for tournaments)
export const FULLY_BOOKED_DAYS = [6, 13, 20, 27];

// Hours that are 100% fully booked across all 9 courts for specific days
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

// Explicit occupied court numbers by day and time slot
export const OCCUPIED_COURTS_BY_DAY_AND_TIME: Record<number, Record<string, number[]>> = {
  9: {
    '08:00 AM': [4, 7],
    '09:00 AM': [2, 5, 8],
    '10:00 AM': [1, 6],
    '11:00 AM': [3, 7, 8],
    '12:00 PM': [2, 5],
    '01:00 PM': [4, 8],
    '02:00 PM': [1, 5, 9],
    '03:00 PM': [2, 6],
    '04:00 PM': [1, 2, 3, 4, 5, 6, 7, 8, 9], // 100% Full
    '05:00 PM': [1, 3, 5, 7],
    '06:00 PM': [2, 4, 6, 8],
    '07:00 PM': [1, 2, 3, 4, 5, 6, 7, 8, 9], // 100% Full
    '08:00 PM': [9],
  },
  10: {
    '08:00 AM': [1, 2, 3, 4, 5, 6, 7, 8, 9], // 100% Full
    '09:00 AM': [1, 3],
    '10:00 AM': [2, 4, 8],
    '11:00 AM': [5, 9],
    '12:00 PM': [6, 7],
    '01:00 PM': [1, 2],
    '02:00 PM': [3, 4],
    '03:00 PM': [5, 6, 7],
    '04:00 PM': [8, 9],
    '05:00 PM': [1, 2, 3, 4, 5, 6, 7, 8, 9], // 100% Full
    '06:00 PM': [2, 4],
    '07:00 PM': [1, 6],
    '08:00 PM': [3, 8],
  },
};

// Current active day reference (today = Sep 9, matching design mock)
export const TODAY_DAY = 9;

/**
 * Check if a calendar date is in the past (cannot navigate back or select).
 */
export const isDateInPast = (day: number, monthOffset: number): boolean => {
  if (monthOffset < 0) return true;
  if (monthOffset === 0 && day < TODAY_DAY) return true;
  return false;
};

/**
 * Check if a specific calendar date is completely booked.
 */
export const isDateFullyBooked = (day: number): boolean => {
  return FULLY_BOOKED_DAYS.includes(day);
};

/**
 * Check if all 9 courts are occupied at a given day and hour.
 */
export const isHourFullyOccupied = (day: number, timeString: string): boolean => {
  if (isDateFullyBooked(day)) return true;

  const dayFullHours = FULLY_BOOKED_HOURS_BY_DAY[day];
  if (dayFullHours && dayFullHours.includes(timeString)) {
    return true;
  }

  // Fallback check on occupied count
  const occupiedCourts = getOccupiedCourtsForSlot(day, timeString);
  return occupiedCourts.length >= 9;
};

/**
 * Get the list of occupied court numbers (1-9) for a specific day and time.
 */
export const getOccupiedCourtsForSlot = (day: number, timeString: string): number[] => {
  if (isDateFullyBooked(day)) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  // Check explicit mock map first
  const dayMap = OCCUPIED_COURTS_BY_DAY_AND_TIME[day];
  if (dayMap && dayMap[timeString]) {
    return dayMap[timeString];
  }

  // Check if it's marked as fully booked hour
  const dayFullHours = FULLY_BOOKED_HOURS_BY_DAY[day];
  if (dayFullHours && dayFullHours.includes(timeString)) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  // Deterministic mock pattern for other dates based on day and hour
  const timeHash = timeString.split(':')[0] ? parseInt(timeString.split(':')[0], 10) : 1;
  const isPM = timeString.includes('PM');
  const numericHour = (isPM && timeHash !== 12 ? timeHash + 12 : timeHash);
  
  const seed = (day * 13 + numericHour * 7) % 9;
  const count = (day + numericHour) % 4; // 0 to 3 courts occupied

  const occupied: number[] = [];
  for (let i = 0; i < count; i++) {
    const courtNum = ((seed + i * 2) % 9) + 1;
    if (!occupied.includes(courtNum)) {
      occupied.push(courtNum);
    }
  }

  return occupied;
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

